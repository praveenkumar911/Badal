const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const winston = require('winston');
const { LogstashTransport } = require('winston-logstash-transport');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

mongoose.set('strictQuery', false);
const mongoUrl = process.env.MONGO_URL 

app.use(express.json());
app.use(cors());
 
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
})
  .then(async () => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

const logger = winston.createLogger({
  transports: [
    new LogstashTransport({
      host: 'localhost',
      port: 9600,
    }),
  ],
});

app.post('/log', (req, res) => {
  const { index, data } = req.body;

  // Log the data using the Winston logger
  logger.log({
    level: 'info',
    message: JSON.stringify({ index, data }),
  });

  res.status(200).send('Data logged successfully!');
});

require('./Schemas/collectionTask');
require('./Schemas/collectionProject');
require('./Schemas/collectionModule'); 
require('./Schemas/collectionUser');
require('./Schemas/collectionTeam');
 // Import the role schema

app.use(require('./routes/gitlab'));
app.use(require('./routes/database'));
app.use(require('./routes/mixedroutes'));
app.use(require('./middleware/RBAC'));

app.listen(5030, () => {
  console.log("Server Started");
});
