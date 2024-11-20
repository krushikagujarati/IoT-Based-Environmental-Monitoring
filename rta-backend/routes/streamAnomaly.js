// const express = require('express');
// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({ clientId: 'anomaly-stream', brokers: ['localhost:9092'] });
// const consumer = kafka.consumer({ groupId: 'anomaly-stream-group' });

// const router = express.Router();
// let clients = []; // Array to store active clients

// async function startConsumer() {
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'anomalies-topic', fromBeginning: true });

//   consumer.run({
//     eachMessage: async ({ message }) => {
//       const data = `data: ${message.value.toString()}\n\n`;
//       // Send the data to all connected clients
//       clients.forEach((client) => client.write(data));
//     },
//   });
// }

// // Start the consumer once when the server starts
// startConsumer().catch(console.error);

// router.get('/', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');

//   // Add the new client to the clients array
//   clients.push(res);
//   console.log('New client connected to anomaly stream');

//   // Remove the client from the array when they disconnect
//   req.on('close', () => {
//     console.log('Client disconnected from anomaly stream');
//     clients = clients.filter((client) => client !== res);
//   });
// });

// module.exports = router;
