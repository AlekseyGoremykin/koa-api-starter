const Joi = require('@hapi/joi');
const validate = require('middlewares/validate');
const writerService = require('resources/writers/writer.service');

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'Last name is required',
    }),
  age: Joi.number()
    .positive()
    .max(150)
    .messages({
      'number.empty': 'Age is required',
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
  const data = ctx.validatedData;
  const { id } = ctx.params;

  ctx.body = await writerService.update(id, (old) => ({ ...old, ...data }));
}

module.exports.register = (router) => {
  router.put('/:id', validate(schema), validator, handler);
};
