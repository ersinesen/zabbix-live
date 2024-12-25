const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
    user: 'zabbix',
    host: '192.168.11.15',
    database: 'zabbix',
    password: 'ersin',
    port: 5432,
});

// Connect to PostgreSQL
client.connect()
    .then(() => {
        // Listen for notifications on the 'notifications' channel
        client.query('LISTEN zabbix_live');
        console.log('Listening for notifications...');
    })
    .catch(err => console.error('Error connecting to the database:', err));

// Event handler for receiving notifications
client.on('notification', (msg) => {
    console.log('Received notification:', msg.payload);
});

client.on("error", (err) => {
    console.error("Error:", err);
});