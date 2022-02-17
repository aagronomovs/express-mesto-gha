const User = require('../models/user');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные'})
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
      }
    })
  };

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден'});
    }
    return res.status(200).send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные'})
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
    }
  })
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Пользователь с указанным _id не найден'});
      }
     return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Введены некорректные данные'})
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
      }
    })
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
  .then((user) => {
    if (!user) {
      return res.status(ERROR_BAD_REQUEST).send({ message: 'Пользователь с указанным _id не найден'});
    }
   return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_NOT_FOUND).send({ message: 'Введены некорректные данные'})
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
    }
  })
};