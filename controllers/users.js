const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Conflict = require('../errors/conflict');

const conflict = require('../utils/errorMessages');
const {
  userNotFound, notFound, badRequestCreateUser, badRequestEditUser,
} = require('../utils/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFound(userNotFound);
    })
    .catch(next);
};

const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(conflict));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(badRequestCreateUser));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw next(new NotFound(notFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(conflict));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(badRequestEditUser));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser, updateUser, login, getMe,
};
