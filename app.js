const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dashboardRouter = require('./app/dashboard/router');
const loginRouter = require('./app/login/router')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dashboard', dashboardRouter);
app.use('/login', loginRouter);

module.exports = app;
