const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');


module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
  .then((user) => {
// создадим токен
const { NODE_ENV, JWT_SECRET } = process.env;
const token = jwt.sign({ _id: user._id },
  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  { expiresIn: '7d' });

// вернём токен
return res.cookie('jwt', token, {
  maxAge: 3600000 * 24 * 7,
  secure: true,
  sameSite: 'none',
})
  .send({ message: 'Вход совершен успешно' });
  })
        .catch(() => {
          next(new UnauthorizedError('Передан неверный логин или пароль'))
        });
    }

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({email})
  .then((user) => {
    if (user) {
      next(new ConflictError('Пользователь с таким email уже существует'))
    } else {
      return bcrypt.hash(password, 10)
    }
  })
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash });
    })

    .then((user) => {
      const dataUser = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        };
      res.send({ data: dataUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'))
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
    next(new NotFoundError('Пользователь с таким id не найден'));
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
      next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundError('Пользователь с таким id не найден'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
      next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
      next(err);
      }
    });
    };