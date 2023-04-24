require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const router = require('./routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';

mongoose.set('strictQuery', true);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors);
app.use(limiter);
app.use(helmet());

app.use(express.json());

mongoose
  .connect(URL)
  .then(() => console.log('Connetced to MongoDB'))
  .catch((err) => console.log(`DB connection error ${err}`));

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use('/', require('./middlewares/errorHandler'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
