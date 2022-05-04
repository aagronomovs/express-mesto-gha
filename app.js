require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const {login, createUser} = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const { centralizedErrors } = require('./middlewares/centralizedErrors');
const { validateLink} = require('./middlewares/validation');
const { PORT = 3000 } = process.env;


const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());
app.use(express.json());

// роуты, не требующие авторизации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateLink),
    email: Joi.string().required().email(),
    password: Joi.string().required()
}),
}),
createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
}),
}),
login);

//авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(routerUser);
app.use(routerCards);


app.use( '*', (req, res, next) => {
  next(new NotFoundError('Запрошенной страницы не существует'))
});
app.use(errors());
app.use(centralizedErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})