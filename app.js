require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const router = require('./routes');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, URL } = require('./utils/constants');

mongoose.set('strictQuery', true);

const app = express();

app.use(cors);

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(express.json());

mongoose
  .connect(URL)
  .then(() => console.log('Connetced to MongoDB'))
  .catch((err) => console.log(`DB connection error ${err}`));

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use('/', require('./middlewares/errorHandler'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
