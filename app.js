const path = require('path');

const express = require('express');

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const { getNotFound } = require('./controllers/not-found');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin);
app.use('/', shop);

app.use(getNotFound);

app.listen(3001);