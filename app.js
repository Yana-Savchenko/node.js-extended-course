const path = require('path');

const express = require('express');
var exphbs = require('express-handlebars');

const admin = require('./routes/admin');
const shop = require('./routes/shop');

const app = express();

app.engine('hbs', exphbs({
  extname: "hbs",
  defaultLayout: 'main-layout',
  layoutsDir: "views/layouts/"
}));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin.routes);
app.use('/', shop);

app.use((req, res, next) => {
  res.status(404).render('not-found', { docTitle: "Page not found" });
})

app.listen(3000);