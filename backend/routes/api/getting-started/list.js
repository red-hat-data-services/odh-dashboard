const gettingStartedUtils = require('./gettingStartedUtils');

module.exports = async function ({ request }) {
  if (request.query.appName) {
    return await gettingStartedUtils.getGettingStartedDoc(request.query.appName);
  }
  // Fetch the installed quick starts
  let gettingStartedDocs = await gettingStartedUtils.getGettingStartedDocs();

  return await Promise.all(gettingStartedDocs);
};
