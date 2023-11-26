const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dashboardRouter = require('./app/dashboard/router');
const authRouter = require('./app/auth/router');
const eventRouter = require('./app/event/router');
const divisionRouter = require('./app/division/router');
const pointTransactionRouter = require('./app/transaction/router');
const userRouter = require('./app/user/router');

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

module.exports = app;
