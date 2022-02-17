// routes/users.js

const routerUser = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  createUser,
} = require('../controllers/users.js');

routerUser.get('/users', getUsers);
routerUser.get('/users/:userId', getCurrentUser);
routerUser.post('/users', createUser);
routerUser.patch('/users/me', updateProfile);
routerUser.patch('/users/me/avatar', updateAvatar);

module.exports = routerUser;