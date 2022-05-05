const Card = require('../models/card');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');


module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'))
      } else {
      next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
    .then((card) => {
     if (card.owner.toString() === req.user._id) {
       return Card.findByIdAndRemove(card._id.toString())
          .then((answer) => res.send({data: answer}))
      } else {
       next(new ForbiddenError('Нет прав на удаление этой карточки'))
      }
    })
      .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
       next(err);
      }
    });
  };

  module.exports.likeCard = (req, res, next) => {
    const { cardId } = req.params;
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true })
      .orFail(() => new NotFoundError('Передан несуществующий id карточки'))
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'CastError') {
         next(new BadRequestError('Переданы некорректные данные для постановки лайка'))
        } else {
         next(err);
        }
      });
  };

  module.exports.dislikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true })
      .orFail(() => new NotFoundError('Передан несуществующий id карточки'))
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestError('Переданы некорректные данные для постановки лайка'))
         } else {
          next(err)
         }
      });
  };