const { Client } = require('pg');
const WebSocket = require('ws');

// Create a new PostgreSQL client
const client = new Client({
    user: 'zabbix',
    host: '192.168.11.15',
    database: 'zabbix',
    password: 'ersin',
    port: 5432,
});

const wss = new WebSocket.Server({ port: 40101 });

client.connect().then(() => {
  console.log('PostgreSQL connected');
  client.query('LISTEN zabbix_live');
  console.log('Listening for notifications on zabbix_live');

  client.on('notification', (msg) => {
    console.log('Notification:', msg);
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg.payload);
      }
    });
  });
});
