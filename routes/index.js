const router = require('express').Router();
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validationCreateUser, validationLoginUser } = require('../middlewares/validation');

const NotFound = require('../errors/notFound');

const { pageNotFound } = require('../utils/errorMessages');

router.post('/signin', validationLoginUser, login);

router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.use('/users', usersRouter);

router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFound(pageNotFound));
});

module.exports = router;
