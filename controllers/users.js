const User = require('../models/user');

const errors = {
  ERROR_CODE_BAD_REQUEST: 400,
  ERROR_CODE_NOT_FOUND: 404,
  ERROR_CODE_DEFAULT: 500,
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в запросе' });
      }
      if (err.message === 'NotFound') {
        return res.status(errors.ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(userID, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(errors.ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userID = req.user._id;
  User.findByIdAndUpdate(userID, { avatar }, {
    runValidators: true,
    new: true,
  })
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(errors.ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getAllUsers, getUser, createUser, updateUserInfo, updateAvatar,
};
