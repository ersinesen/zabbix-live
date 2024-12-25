const WebSocket = require("ws");
const { createLogger, format, transports } = require("winston");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Logger setup
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.label({ label: path.basename(__filename) }),
    format.timestamp(),
    format.printf(({ level, message, timestamp, label }) => `[${timestamp}] [${level}] [${label}] ${message}`)
  ),
  transports: [new transports.Console(), new transports.File({ filename: "client.log" })],
});

// WebSocket client class
class WebSocketClient {
  constructor(serverUrl, clientChannel) {
    this.clientId = uuidv4();  // Generate unique client ID
    this.clientChannel = clientChannel;  // Store channel name
    this.ws = new WebSocket(serverUrl);  // Initialize WebSocket connection

    // Bind event handlers
    this.ws.on("open", () => this.onOpen());
    this.ws.on("message", (message) => this.onMessage(message));
    this.ws.on("close", () => this.onClose());
    this.ws.on("error", (error) => this.onError(error));
  }

  onOpen() {
    logger.info(`WebSocket connected for client ${this.clientId}`);
    this.ws.send(JSON.stringify({
      action: "subscribe",
      clientId: this.clientId,
      clientChannel: this.clientChannel,
    }));
  }

  onMessage(message) {
    logger.info(`Received message: ${message}`);
  }

  onClose() {
    logger.info("WebSocket connection closed");
  }

  onError(error) {
    logger.error("WebSocket error:", error);
  }
}

// Create WebSocket client instance
const client = new WebSocketClient("ws://localhost:40101", "48872");
