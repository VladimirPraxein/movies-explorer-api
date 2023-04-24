const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlPattern, idPattern } = require('../utils/constants');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(urlPattern),
      trailerLink: Joi.string().required().pattern(urlPattern),
      thumbnail: Joi.string().required().pattern(urlPattern),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
moviesRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().pattern(idPattern),
    }),
  }),
  deleteMovie,
);

module.exports = moviesRouter;
