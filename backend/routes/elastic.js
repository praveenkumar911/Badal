const winston = require('winston');
const { LogstashTransport } = require('winston-logstash-transport');


const logger = winston.createLogger({
    transports: [
      new LogstashTransport({
        host: 'localhost',
        port: 9600,
      }),
    ],
  });
  
  // Define an endpoint to receive data and log it
app.post('/log', (req, res) => {
    const { index, data } = req.body;
    //const { message, timestamp } = data;
  
    // Log the data using the Winston logger
    logger.log({
      level: 'info',
      message: JSON.stringify({ index, data }),
    });
  
    res.status(200).send('Data logged successfully!');
  });
  