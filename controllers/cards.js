const Card = require('../models/card');
const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;


module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные'})
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
      }
    })
};

module.exports.deleteCard = (req, res) => {
     Card.findById(req.params.cardId)
    .then((card) => {
     if (!card) {
       return res.status(ERROR_BAD_REQUEST).send( { message: 'Карточка с указанным _id не найдена.'});
      }
      else if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        return res.status(ERROR_NOT_FOUND).send( { message: 'Невозможно удалить данную карточку'});
      }
     return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию.' });
      }
    });
  }

  module.exports.likeCard = (req, res) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          return res.status(ERROR_NOT_FOUND).send({ message:'Карточка с указанным _id не найдена.'});
        }
        else {
          return res.status(200).send({ data: card });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка'})
        } else {
          res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
        }
      })
  };

  module.exports.dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          return res.status(ERROR_NOT_FOUND).send( { message:'Карточка с указанным _id не найдена.'});
        } else {
          return res.status(200).send({ data: card });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка'})
        } else {
          res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
        }
      })
  };