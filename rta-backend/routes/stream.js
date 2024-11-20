const express = require('express');
const router = express.Router();
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const portPath = 'COM3';  // Replace with your actual port, e.g., COM3 on Windows
const baudRate = 9600;    // Ensure this matches the Arduino baud rate

// Set up the serial port and the parser
const port = new SerialPort({ path: portPath, baudRate });
const parser = new ReadlineParser({ delimiter: '\n' });
port.pipe(parser); // Pipe the serial port data through the parser

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log("Client connected, starting to stream data from Arduino...");

    // Listen for JSON data from the Arduino
    parser.on('data', (data) => {
        try {
            const jsonData = JSON.parse(data);  // Parse the JSON data
            console.log(`Received data: ${JSON.stringify(jsonData)}`);
            res.write(`data: ${JSON.stringify(jsonData)}\n\n`); // Send data to client
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    });

    // Handle client disconnect
    req.on('close', () => {
        console.log("Client disconnected, stopping data stream.");
        parser.removeAllListeners('data'); // Stop listening for data
    });
});

module.exports = router;
