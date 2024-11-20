import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Box, Snackbar, Alert,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import AlarmIcon from '@mui/icons-material/Alarm';
import ShowChartIcon from '@mui/icons-material/ShowChart';

function Dashboard() {
  const [lineChartData, setLineChartData] = useState([]);
  const [pmChartData, setPmChartData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [fireAlarmStatus, setFireAlarmStatus] = useState(0);
  const [aqi, setAqi] = useState(0);
  const [noise, setNoise] = useState(0);
  const [dataQualityStatus, setDataQualityStatus] = useState('Streaming');
  const [lastCnt, setLastCnt] = useState(null); 
  const [latestData, setLatestData] = useState({ TVOC: 0, eCO2: 0, PM1: 0, PM2_5: 0 });

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/api/stream');

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log('Received streaming data:', newData);

      const time = new Date().toLocaleTimeString(); 
      const humidity = parseFloat(newData['Humidity[%]']);
      const temperature = parseFloat(newData['Temperature[C]']);
      const pm1 = parseFloat(newData['PM1.0']);
      const pm25 = parseFloat(newData['PM2.5']);
      const eCO2 = parseFloat(newData['eCO2[ppm]']);
      const TVOC = parseFloat(newData['TVOC[ppb]']);
      const fireAlarm = parseInt(newData['Fire Alarm'], 10); 
      const cnt = parseInt(newData['CNT'], 10);

      setLineChartData((prevData) => {
        const updatedData = [...prevData, { time, humidity, temperature }];
        return updatedData.slice(-6); 
      });
      
      if (lastCnt !== null && cnt === lastCnt) {
        setDataQualityStatus('Disconnected');
      } else {
        setDataQualityStatus('Streaming');
      }
      setLastCnt(cnt);
      const calculatedAqi = parseFloat(newData['AirQuality']);
      setAqi(calculatedAqi);
      const calculatedNoise = parseFloat(newData['NoiseLevel']);
      setNoise(calculatedNoise);
    };

    eventSource.onerror = () => {
      console.error('Error receiving streaming data');
      eventSource.close();
    };

    const anomalyStream = new EventSource('http://localhost:5000/api/stream-anomaly');
    anomalyStream.onmessage = (event) => {
      const anomalyData = JSON.parse(event.data);
      console.log('Received anomaly data:', anomalyData);
      setNotification(`Anomaly detected! Temperature: ${anomalyData['Temperature[C]']}°C`);
    };
    anomalyStream.onerror = () => {
      console.error('Error receiving anomaly data');
      anomalyStream.close();
    };
    // Cleanup on component unmount
    return () => {
      eventSource.close();
      anomalyStream.close();
    };
  }, []);

  const handleNotificationClose = () => {
    setNotification(null);
  };
  const aqiData = [
    {
      name: 'AQI',
      value: aqi,
      fill: aqi <= 50 ? '#4caf50' : aqi <= 100 ? '#ffeb3b' : '#f44336', // Green for Good, Yellow for Moderate, Red for Unhealthy
    },
  ];
  const noiseData = [
    {
      name: 'Noise',
      value: noise,
      fill: noise <= 100 ? '#4caf50' : noise <= 500 ? '#ffeb3b' : '#f44336', // Green for Good, Yellow for Moderate, Red for Unhealthy
    },
  ];
  const lastTemperature = lineChartData.length > 0 ? lineChartData[lineChartData.length - 1].temperature : null;
  const lastHumidity = lineChartData.length > 0 ? lineChartData[lineChartData.length - 1].humidity : null;
  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Real-time Analytics and Intelligence of Streaming Data
      </Typography> */}
      <Grid container spacing={3}>

        {/* Data Quality Status */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '15px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShowChartIcon style={{ fontSize: 50, color: dataQualityStatus === 'Streaming' ? '#4caf50' : '#f44336' }} />
              <Typography variant="h6" sx={{ fontWeight: '600', color: '#555' }}>
                Data Quality Status
              </Typography>
              <Typography variant="body2" sx={{ color: dataQualityStatus === 'Streaming' ? '#4caf50' : '#f44336', fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>
                {dataQualityStatus === 'Streaming' ? '🟢 Data Streaming' : '🔴 Disconnected'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        
        {/* Noise Gauge */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '15px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', color: '#555' }}>
                Noise Levels
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={noiseData} startAngle={180} endAngle={0}>
                  <PolarAngleAxis type="number" domain={[0, 1050]} angleAxisId={0} tick={false} />
                  <RadialBar background clockWise dataKey="value" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <Typography variant="h6" sx={{ fontWeight: 'bold',marginTop: '-90px', color: aqi <= 50 ? '#4caf50' : aqi <= 100 ? '#ffeb3b' : '#f44336' }}>
                {noise <= 100 ? 'Good' : noise <= 500 ? 'Moderate' : 'Unhealthy'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#777', marginTop: '8px' }}>
                Current Noise: {Math.round(noise)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* AQI Gauge */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '15px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', color: '#555' }}>
                Air Quality Index (AQI)
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={aqiData} startAngle={180} endAngle={0}>
                  <PolarAngleAxis type="number" domain={[0, 150]} angleAxisId={0} tick={false} />
                  <RadialBar background clockWise dataKey="value" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <Typography variant="h6" sx={{ fontWeight: 'bold',marginTop: '-90px', color: aqi <= 50 ? '#4caf50' : aqi <= 100 ? '#ffeb3b' : '#f44336' }}>
                {aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : 'Unhealthy'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#777', marginTop: '8px' }}>
                Current AQI: {Math.round(aqi)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Panel */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '15px', overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: '600', color: '#555', textAlign: 'center' }}>
                Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#555' }}>Metric</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#555' }}>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>Noise Levels</TableCell>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>{Math.round(noise)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>AQI</TableCell>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>{Math.round(aqi)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>Temperature (°C)</TableCell>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>{lastTemperature !== null ? `${lastTemperature}°C` : 'No data available'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>Humidity (%)</TableCell>
                      <TableCell align="center" sx={{ color: '#777', padding: '4px 8px' }}>{lastHumidity !== null ? `${lastHumidity}%` : 'No data available'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>


        {/* Line Chart for Humidity and Temperature */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '20px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: '600', color: '#555', textAlign: 'center' }}>
              Temperature Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#FF0000" name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Particulate Matter Levels Chart for PM1.0 and PM2.5 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: '20px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: '600', color: '#555', textAlign: 'center' }}>
              Humidity Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="humidity" stroke="#0088FE" name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

      </Grid>
      <Snackbar open={!!notification} autoHideDuration={12000} onClose={handleNotificationClose}>
        <Alert severity="warning" onClose={handleNotificationClose}>
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
