// routes/users.js

const routerUser = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users.js');
const { validateUserId, validateProfile, validateAvatar } = require('../middlewares/validation');

routerUser.get('/users', getUsers);
routerUser.get('/users/me', getCurrentUser);
routerUser.get('/users/:userId', validateUserId, getUserById);

routerUser.patch('/users/me', validateProfile, updateProfile);
routerUser.patch('/users/me/avatar', validateAvatar, updateAvatar);

module.exports = routerUser;