const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const SALT_ROUND = 10;


module.exports.login = (req, res, next) => {
  const {
    email,
    password
  } = req.body;

 return User.findUserByCredentials(email, password)
  .then((user) => {
      // создадим токен

    const token = jwt.sign({ _id: user._id},
    'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      //return res.cookie('jwt', token, {
      //  maxAge: 3600000 * 24 * 7,
      //  httpOnly: true,
      //  sameSite: 'none',
      //})
      res.status(200).send({ token });
   })
   .catch(() => {
     next(new UnauthorizedError('Передан неверный логин или пароль'))
   });
}


module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password
  } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Нужны почта и пароль'));
  }

 // User.findOne({email})
 // .then((user) => {
   // if (user) {
     // return next(new ConflictError('Пользователь с таким email уже существует'));
    //} else {
      return bcrypt.hash(req.body.password, SALT_ROUND)
   // }
  //})
  .then((hash) => {
    return User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash
    });
  })

  .then((user) => res.send({ name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id}))
  .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'))
      } if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
        return next(err);

    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const {
    name,
    about
  } = req.body;
  User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true,
        runValidators: true
      },
    )
    .orFail(() => new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id пользователя'));
      }
      else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
      req.user._id, { avatar }, {
        new: true,
        runValidators: true
      })
    .orFail(() => new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};