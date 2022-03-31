require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const {
  notFoundMiddleware,
  errorMiddleware,
  authenticate,
} = require('./middleware');
const connectDB = require('./db/connect');
const { authRouter, jobsRouter } = require('./routes');

const app = express();

// only for deploy
// app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticate, jobsRouter);

// only for deploy
// before app.use('/api/v1/..') routes
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
// });

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};
start();
