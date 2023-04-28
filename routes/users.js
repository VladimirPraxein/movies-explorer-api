const usersRouter = require('express').Router();
const { validationUpdateUser } = require('../middlewares/validation');

const {
  getMe, updateUser,
} = require('../controllers/users');

usersRouter.get('/me', getMe);
usersRouter.patch(
  '/me',
  validationUpdateUser,
  updateUser,
);

module.exports = usersRouter;
