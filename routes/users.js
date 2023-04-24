const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { emailPattern } = require('../utils/constants');

const {
  getMe, updateUser,
} = require('../controllers/users');

usersRouter.get('/me', getMe);
usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().pattern(emailPattern),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

module.exports = usersRouter;
