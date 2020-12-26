const path = require('path');

const express = require('express');

const admin = require('./routes/admin');
const shop = require('./routes/shop');

const app = express();

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin.routes);
app.use(shop);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
})

app.listen(3000);