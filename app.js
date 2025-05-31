// Connect to the WebSocket server
const socket = new WebSocket("ws://localhost:8080");

console.log("Connecting to the chat server...");

socket.addEventListener("open", () => {
    console.log("Connected to the chat server!");

    // Send a welcome message (optional)
    console.log("Type sendMessage(text) to chat with the other user.");
});

// Listen for incoming messages
socket.addEventListener("message", (event) => {
    console.log(`> ${event.data}`); // Log messages received from the server
});

// Function to send a message to the other user
function sendMessage(text) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(text);
        console.log(`You: ${text}`);
    } else {
        console.error("Cannot send message: Socket is not open.");
    }
}

// Notify the user when the connection closes
socket.addEventListener("close", () => {
    console.log("Connection closed by the server.");
});