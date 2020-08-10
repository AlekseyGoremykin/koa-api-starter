const Joi = require('@hapi/joi');
const { v4: uuidv4 } = require('uuid');
const validate = require('middlewares/validate');
const writerService = require('resources/writers/writer.service');

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Last name is required',
    }),
  age: Joi.number()
    .positive()
    .max(150)
    .required()
    .messages({
      'number.empty': 'Age is required',
    }),
  books: Joi.array()
    .items({
      title: Joi.string()
        .trim()
        .required()
        .messages({
          'string.empty': 'title is required',
        }),
      genre: Joi.string()
        .required()
        .valid('novel', 'poem'),
    }),
});

async function validator(ctx, next) {
  const { firstName, lastName } = ctx.validatedData;
  const isWriterAdded = await writerService.exists({
    firstName,
    lastName,
  });

  if (isWriterAdded) {
    ctx.body = {
      errors: {
        firstName: ['This writer is already added'],
        lastName: ['This writer is already added'],
      },
    };
    ctx.throw(400);
  }

  await next();
}

async function handler(ctx) {
  const {
    firstName, lastName, age, books,
  } = ctx.validatedData;

  ctx.body = await writerService.create({
    firstName,
    lastName,
    age,
    books: (books || []).map((book) => ({ ...book, _id: uuidv4() })),
  });
}

module.exports.register = (router) => {
  router.post('/', validate(schema), validator, handler);
};
