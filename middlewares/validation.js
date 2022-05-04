const validator = require('validator');
const { celebrate, Joi } = require('celebrate');


const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().alphanum(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required().alphanum(),
  }),
});

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  })
})

const validateLink = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки')
  }
  return value;
};

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateLink)
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateLink)
  }),
});

module.exports = { validateUserId, validateCardId, validateProfile, validateLink, validateAvatar, validateCard };