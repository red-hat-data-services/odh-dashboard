const _ = require('lodash');
const quickStartUtils = require('./quickStartUtils');

module.exports = async function ({ fastify }) {
  // Fetch the installed kfDefs
  const quickStarts = await quickStartUtils.getInstalledQuickStarts(fastify);

  return await Promise.all(quickStarts);
};
