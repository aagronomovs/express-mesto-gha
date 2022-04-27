const routerCards = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards.js');
const { validateCardId } = require('../middlewares/validation');

routerCards.get('/cards', getCards);
routerCards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
}), createCard);
routerCards.delete('/cards/:cardId', validateCardId, deleteCard);
routerCards.put('/cards/:cardId/likes', validateCardId, likeCard);
routerCards.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = routerCards;