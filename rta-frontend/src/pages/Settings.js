// src/pages/Settings.js
import React from 'react';

function Settings() {
  return (
    <>
    <div style={{ textAlign: 'center', margin: '2% 20%' }}>
      <div style={{ textAlign: 'left' }}>
        <h3>Arduino Uno IDE - Arduino Program Overview</h3>

        <h3>Program Summary</h3>
        <p>This Arduino program collects environmental data from multiple sensors and outputs it in JSON format via the Serial Monitor. The sensors used include:</p>
          <ul>
              <li>DHT11 - Temperature and Humidity Sensor</li>
              <li>Analog Noise Sensor</li>
              <li>Analog Air Quality Sensor</li>
          </ul>

        <h3>Pin Configuration</h3>
        <ul>
            <li><strong>DHTPIN</strong>: Digital Pin 2 - Used for the DHT11 temperature and humidity sensor.</li>
            <li><strong>NOISE_PIN</strong>: Analog Pin A1 - Used for the noise sensor.</li>
            <li><strong>AIR_QUALITY_PIN</strong>: Analog Pin A2 - Used for the air quality sensor.</li>
        </ul>

        <h3>Program Workflow</h3>
        <p>The program performs the following actions in an infinite loop:</p>
        <ol>
            <li>Begins serial communication at a baud rate of 9600 to display data in the Serial Monitor.</li>
            <li>Initializes the DHT11 sensor to read temperature and humidity values.</li>
            <li>Reads temperature and humidity from the DHT11 sensor. If there’s an error in reading, it prints an error message to the Serial Monitor.</li>
            <li>Reads an analog value from the noise sensor connected to <code>NOISE_PIN</code> (A1), which represents the ambient noise level.</li>
            <li>Reads an analog value from the air quality sensor connected to <code>AIR_QUALITY_PIN</code> (A2), which represents the air quality level.</li>
            <li>Formats the data as a JSON object and prints it to the Serial Monitor. Example output:</li>
            "Temperature[C]: 25.0", "Humidity[%]: 50", "NoiseLevel: 300", "AirQuality: 450"
        </ol>

        <h3>Delay Between Readings</h3>
        <p>The program waits for 2 seconds between each loop iteration to prevent excessive readings, making it easier to observe changes over time.</p>

        <h3>Usage</h3>
        <p>This program can be used to log environmental conditions in JSON format for analysis or interfacing with other applications, such as a dashboard displaying live environmental data.</p>
      </div>
      <img src={`${process.env.PUBLIC_URL}/Arduino Uno.png`} 
        alt="Arduino IDE Setup"
        style={{ height: '600px' }} />
      <h3>Setup</h3>
      <img src={`${process.env.PUBLIC_URL}/Setup-image.jpeg`} 
        alt="Setup"
        style={{ height: '600px' }} />
      <h3>Arduino Uno</h3>
      <img src={`${process.env.PUBLIC_URL}/ArduinoUno.jpeg`} 
        alt="ArduinoUno"
        style={{ height: '600px' }} />
      <h3>Temperature sensor</h3>
      <img src={`${process.env.PUBLIC_URL}/temp.jpeg`} 
        alt="temp-sensor"
        style={{ height: '600px' }} />
      <h3>Noise sensor</h3>
      <img src={`${process.env.PUBLIC_URL}/noise.jpeg`} 
        alt="noise-sensor"
        style={{ height: '600px' }} />
      <h3>Air quality sensor</h3>
      <img src={`${process.env.PUBLIC_URL}/Airquality.jpeg`} 
        alt="Airquality-sensor"
        style={{ height: '600px' }} />
    </div>
    </>
  )
}

export default Settings;
