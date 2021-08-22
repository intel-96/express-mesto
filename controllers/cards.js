const Card = require('../models/card');

const errors = {
  ERROR_CODE_BAD_REQUEST: 400,
  ERROR_CODE_NOT_FOUND: 404,
  ERROR_CODE_DEFAULT: 500,
};

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в запросе' });
      } else {
        res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в запросе' });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(errors.ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным ID не найдена' });
        return;
      }
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в запросе' });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(errors.ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным ID не найдена' });
        return;
      }
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errors.ERROR_CODE_BAD_REQUEST).send({ message: 'Ошибка в запросе' });
        return;
      }
      if (err.message === 'NotFound') {
        res.status(errors.ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным ID не найдена' });
        return;
      }
      res.status(errors.ERROR_CODE_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = { getAllCards, createCard, deleteCard, likeCard, dislikeCard };
