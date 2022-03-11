const Card = require('../models/card');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');


module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'))
      }
      next(err);
    })
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
     if (card.owner._id.toString() === req.user._id) {
      card.findByIdandRemove(req.params.cardId)
      .orFail(() => {
        throw new NotFoundError('Карточка с указанным id не найдена');
      })
      .then((deletedCard) => {
        res.send({data: deletedCard});
      })
      .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      }
      next(err);
    });
   } else {
       next(new ForbiddenError('Нет прав на удаление этой карточки'));
      }
    })
    .catch(next);
  }

  module.exports.likeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card) {
          return res.send({ data: card });
        }
        throw new NotFoundError('Передан несуществующий id карточки')
      })
      .catch((err) => {
        if (err.name === 'CastError') {
         next(new BadRequestError('Переданы некорректные данные для постановки лайка'))
        }
         next(err);
        })
  };

  module.exports.dislikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card) {
          return res.send({ data: card });
        }
        throw new NotFoundError('Передан несуществующий id карточки');
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestError('Переданы некорректные данные для постановки лайка'))
         }
          next(err);
         });
  };