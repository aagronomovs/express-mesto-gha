const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3001 } = process.env;


const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  });

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '620b6570ee3fa7514ed86387' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(routerUser);
app.use(routerCards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})