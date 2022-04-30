const routerCards = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards.js');
const { validateCardId, validateCard } = require('../middlewares/validation');

routerCards.get('/cards', getCards);
routerCards.post('/cards', validateCard, createCard);
routerCards.delete('/cards/:cardId', validateCardId, deleteCard);
routerCards.put('/cards/:cardId/likes', validateCardId, likeCard);
routerCards.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = routerCards;