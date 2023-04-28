const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

const {
  movieNotFound, forbidden, badRequestCreateMovie, badRequestDeleteMovie,
} = require('../utils/errorMessages');

const getMovies = (req, res, next) => {
  Movie
    .find({})
    .populate(['owner'])
    .then((movies) => res.send(movies.filter((movie) => String(movie.owner._id) === req.user._id)))
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
        next(new BadRequest(badRequestCreateMovie));
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
        throw next(new NotFound(movieNotFound));
      }
      if (String(movie.owner._id) !== owner._id) {
        throw next(new Forbidden(forbidden));
      }
      return movie.remove()
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest(badRequestDeleteMovie));
      }
      next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
