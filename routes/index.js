const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFound = require('../errors/notFound');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

router.use(auth);

router.use('/users', usersRouter);

router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден.'));
});

module.exports = router;
