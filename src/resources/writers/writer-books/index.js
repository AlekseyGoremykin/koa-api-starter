const Joi = require('@hapi/joi');
const { v4: uuidv4 } = require('uuid');
const validate = require('middlewares/validate');
const writerService = require('resources/writers/writer.service');

const bookSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'title is required',
    }),
  genre: Joi.string()
    .required()
    .valid('novel', 'poem'),
});

const booksSchema = Joi.object({
  books: Joi.array()
    .items(bookSchema),
});

const emptySchema = Joi.object();

async function validator(ctx, next) {
  const { writerId } = ctx.params;

  const isWriterExists = await writerService.exists({
    _id: writerId,
  });

  if (!isWriterExists) {
    ctx.body = {
      errors: {
        writerId: ['Writer is not found'],
      },
    };
    ctx.throw(400);
  }

  await next();
}

async function handleCreate(ctx) {
  const { writerId } = ctx.params;
  const book = ctx.validatedData;

  book._id = uuidv4();

  await writerService.atomic.update(
    { _id: writerId },
    { $push: { books: book } },
  );

  ctx.body = book;
}

async function handleUpdateAll(ctx) {
  const { writerId } = ctx.params;
  const { books } = ctx.validatedData;
  const newBooks = (books || []).map((book) => ({ ...book, _id: uuidv4() }));

  await writerService.atomic.update(
    { _id: writerId },
    { $set: { books: newBooks } },
  );

  ctx.body = newBooks;
}

async function handleDelete(ctx) {
  const { writerId, bookId } = ctx.params;

  await writerService.atomic.update(
    { _id: writerId },
    { $pull: { books: { _id: bookId } } },
  );

  ctx.body = {};
}

module.exports.register = (router) => {
  router.post('/:writerId/books', validate(bookSchema), validator, handleCreate);
  router.put('/:writerId/books', validate(booksSchema), validator, handleUpdateAll);
  router.delete('/:writerId/books/:bookId', validate(emptySchema), handleDelete);
};
