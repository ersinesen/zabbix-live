// WebSocket client class
class WebSocketClient {
  constructor(serverUrl, clientChannel, onMessageCallback) {
    this.clientId = self.crypto.randomUUID();  // Generate unique client ID
    this.clientChannel = clientChannel;  // Store channel name
    this.ws = new WebSocket(serverUrl);  // Initialize WebSocket connection
    this.onMessageCallback = onMessageCallback; // Callback for handling incoming messages

    // Bind event handlers
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  onOpen() {
    console.log(`WebSocket connected for client ${this.clientId}`);
    this.ws.send(JSON.stringify({
      action: "subscribe",
      clientId: this.clientId,
      clientChannel: this.clientChannel,
    }));
  }

  onMessage(event) {
    const message = event.data;
    //console.log(`Received message: ${message}`);
    const parsedMessage = JSON.parse(message);
    //console.log("Parsed message:", parsedMessage);

    const ts = parsedMessage.ts;
    const value = parsedMessage.value;
    //console.log("Timestamp:", ts, "Value:", value);

    if (this.onMessageCallback) {
        this.onMessageCallback(ts, value); 
    }
  }

  onClose() {
    console.log("WebSocket connection closed");
  }

  onError(error) {
    console.error("WebSocket error:", error);
  }

  destroy() {
    if (this.ws) {
        this.ws.onmessage = null; // Remove the message event handler
        this.ws.close(); // Close the WebSocket connection
        this.ws = null;
    }
  }

}

