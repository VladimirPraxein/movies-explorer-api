const moviesRouter = require('express').Router();
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post(
  '/',
  validationCreateMovie,
  createMovie,
);
moviesRouter.delete(
  '/:movieId',
  validationDeleteMovie,
  deleteMovie,
);

module.exports = moviesRouter;
