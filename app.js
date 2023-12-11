const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const dashboardRouter = require('./app/dashboard/router');
const authRouter = require('./app/auth/router');
const eventRouter = require('./app/event/router');
const divisionRouter = require('./app/division/router');
const pointTransactionRouter = require('./app/transaction/router');
const userRouter = require('./app/user/router');
const {MONGO_URI} = require("./config/env");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dashboard', dashboardRouter);
app.use('/auth', authRouter);
app.use('/event', eventRouter);
app.use('/division', divisionRouter);
app.use('/point-transaction', pointTransactionRouter);
app.use('/user', userRouter);

mongoose?.connect(MONGO_URI)
    .then(() => console.log('Connected to database!'))
    .catch((e) => {
      throw new Error(e);
    });

module.exports = app;
