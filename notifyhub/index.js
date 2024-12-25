const { Client } = require('pg');
const WebSocket = require('ws');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Create a custom log format function
const customFormat = format.printf(({ level, message, timestamp, label, stack }) => {
  return `[${timestamp}] [${level}] [${label}] ${message}`;
});

// Create the logger
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.label({ label: path.basename(__filename) }),
    format.timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "notifyhub.log" })
  ]
});

// WebSocket server
const PORT = 40101;
const wss = new WebSocket.Server({ port: PORT });
logger.info(`WebSocket server is running on port ${PORT}`);

// Store WebSocket clients by itemid
let clientsByItemId = {};

// Function to create and connect PostgreSQL client
let client;
const connectPostgres = async () => {
  const client = new Client({
    user: 'zabbix',
    host: '192.168.11.15',
    database: 'zabbix',
    password: 'ersin',
    port: 5432,
  });

  try {
    await client.connect();
    logger.info('Connected to PostgreSQL');
    await client.query('LISTEN zabbix_live');
    logger.info('Listening for notifications on zabbix_live');
    
    // Handle PostgreSQL notifications
    client.on('notification', (msg) => {
      logger.debug(`Notification received: ${JSON.stringify(msg)}`);
    
      // Parse the payload to extract itemid
      const notification = msg.payload.split(',').reduce((acc, part) => {
        const [key, value] = part.split(':');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});
    
      const itemid = notification.itemid;
    
      // Log the clients subscribed to this itemid
      if (clientsByItemId[itemid]) {
        logger.info(
          `Received notification for itemid: ${itemid} - clients: ${JSON.stringify(
            clientsByItemId[itemid].map((client) => client.clientId)
          )}`
        );
      }
    
      // Check if we have clients subscribed to this itemid
      if (clientsByItemId[itemid]) {
        // Send the notification to all WebSocket clients subscribed to the itemid
        clientsByItemId[itemid].forEach((client) => {
          if (client.ws.readyState === WebSocket.OPEN) {
            //client.ws.send(JSON.stringify(notification));
            client.ws.send(`{"ts":${notification.ts},"value":"${notification.value}"}`);
          }
        });
      }
    });    
    
    client.on('error', async (err) => {
      logger.error(`PostgreSQL client error: ${err.message}`, { stack: err.stack });
      // Try to reconnect if there is an error
      logger.info('Attempting to reconnect to PostgreSQL...');
      await reconnectPostgres();
    });
  } catch (err) {
    logger.error(`Failed to connect to PostgreSQL: ${err.message}`, { stack: err.stack });
    // Retry connection after a delay
    setTimeout(connectPostgres, 5000); // Retry in 5 seconds
  }
};

// Reconnect to PostgreSQL by creating a new client instance
const reconnectPostgres = () => {
  if (client) {
    logger.info('Closing previous PostgreSQL client (if any) and attempting reconnection...');
    try {
      client.end().catch((err) => logger.error(`Error closing PostgreSQL client: ${err.message}`));
    } catch (err) {
      logger.error(`Error while closing client: ${err.message}`, { stack: err.stack });
    }
  }
  connectPostgres();
};

// Start PostgreSQL connection
connectPostgres();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  logger.info('New WebSocket client connected');

  // When a client sends a message
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      logger.info(`Received message from client: ${message}`);

      // Check if the message is a subscription action
      if (data.action === 'subscribe' && data.clientId && data.clientChannel) {
        const itemid = data.clientChannel; // Use clientChannel as the itemid

        if (!clientsByItemId[itemid]) {
          clientsByItemId[itemid] = [];
        }

        // Add the client to the itemid's subscriber list
        clientsByItemId[itemid].push({ ws, clientId: data.clientId });

        logger.info(`Client subscribed to itemid: ${itemid}`);
      } else {
        logger.warn(`Invalid subscription message: ${message}`);
      }
    } catch (err) {
      logger.error(`Failed to process client message: ${err.message}`);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    logger.info('WebSocket client disconnected');

    // Remove the client from all itemid subscriptions
    for (const [itemid, clients] of Object.entries(clientsByItemId)) {
      clientsByItemId[itemid] = clients.filter(client => client.ws !== ws);

      if (clientsByItemId[itemid].length === 0) {
        delete clientsByItemId[itemid]; // Clean up empty itemid entries
      }
    }
  });
});


wss.on('error', (err) => {
  logger.error(`WebSocket server error: ${err.message}`, { stack: err.stack });
});
