const writerService = require('resources/writers/writer.service');

async function handler(ctx) {
  const { id } = ctx.params;

  ctx.body = await writerService.findOne({ _id: id });
}

module.exports.register = (router) => {
  router.get('/:id', handler);
};
