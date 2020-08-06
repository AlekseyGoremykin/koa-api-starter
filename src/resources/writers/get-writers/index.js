const Joi = require('@hapi/joi');
const validate = require('middlewares/validate');
const writerService = require('resources/writers/writer.service');

const schema = Joi.object({
  pageNumber: Joi.number()
    .min(0)
    .default(0),
  pageSize: Joi.number()
    .min(1)
    .max(5)
    .default(5),
  sortBy: Joi.string()
    .default('_id'),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('asc'),
});

async function handler(ctx) {
  const {
    pageNumber,
    pageSize,
    sortBy,
    sortOrder,
  } = ctx.validatedData;
  const findOptions = {
    page: pageNumber + 1,
    perPage: pageSize,
    sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
  };
  const { results, count } = await writerService.find({}, findOptions);

  ctx.body = {
    data: results,
    meta: { numberOfAllDocuments: count },
  };
}

module.exports.register = (router) => {
  router.get('/', validate(schema), handler);
};
