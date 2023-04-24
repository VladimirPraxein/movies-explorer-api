const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  Movie
    .find({})
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user;
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user;
  const { movieId } = req.params;
  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw next(new NotFound('Фильм с указанным _id не найден.'));
      }
      if (String(movie.owner._id) !== owner._id) {
        throw next(new Forbidden('Невозможно удалить чужой фильм.'));
      }
      return movie.remove()
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Передан неккоректный _id.'));
      }
      next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
