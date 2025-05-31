const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket server started on ws://localhost:8080");

// Store exactly two client connections
let clients = [];

wss.on('connection', (socket) => {
    if (clients.length >= 2) {
        // Reject additional clients
        socket.send("Server is full. Only two participants are allowed.");
        socket.close();
        return;
    }

    console.log("New client connected!");
    clients.push(socket);

    // Notify both users when someone joins
    const userIndex = clients.indexOf(socket);
    socket.send(`You are User ${userIndex + 1}`);
    clients.forEach((client, index) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(`User ${userIndex + 1} has joined the chat.`);
        }
    });

    // Handle incoming messages
    socket.on('message', (message) => {
        console.log(`Message from User ${userIndex + 1}: ${message}`);

        // Send the message to the other client
        clients.forEach((client, index) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(`User ${userIndex + 1}: ${message}`);
            }
        });
    });

    // Handle disconnections
    socket.on('close', () => {
        console.log(`User ${userIndex + 1} disconnected.`);
        clients = clients.filter(client => client !== socket);

        // Notify the remaining user
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`User ${userIndex + 1} has left the chat.`);
            }
        });
    });
});