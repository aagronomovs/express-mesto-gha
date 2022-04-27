// routes/users.js

const routerUser = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,

} = require('../controllers/users.js');
const { validateUserId } = require('../middlewares/validation');

routerUser.get('/users', getUsers);
routerUser.get('/users/me', getCurrentUser);
routerUser.get('/users/:userId', validateUserId, getUserById);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

routerUser.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
}), updateAvatar);

module.exports = routerUser;