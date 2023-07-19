 const io  =require("socket.io-client")

const socket = io("http://localhost:3000");

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('message', (data) => {
  console.log('Received message:', data);
});

socket.emit('message', { message: 'Hello, server!' });

;