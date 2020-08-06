const Joi = require('@hapi/joi');

const schema = Joi.object({
  _id: Joi.string(),
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  age: Joi.number()
    .positive()
    .max(150)
    .required(),
  createdOn: Joi.date(),
  books: Joi.array()
    .required()
    .items(Joi.object({
      _id: Joi.string()
        .required(),
      title: Joi.string()
        .required(),
      genre: Joi.string()
        .required()
        .valid('novel', 'poem'),
    })),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
