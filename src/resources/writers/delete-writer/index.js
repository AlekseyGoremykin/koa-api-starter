const writerService = require('resources/writers/writer.service');

async function handler(ctx) {
  const { id } = ctx.params;

  await writerService.remove({ _id: id });

  ctx.body = {};
}

module.exports.register = (router) => {
  router.delete('/:id', handler);
};
