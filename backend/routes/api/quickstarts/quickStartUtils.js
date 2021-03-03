const createError = require('http-errors');
const constants = require('../../../utils/constants');
const getMockQuickStarts = require('../../../__mocks__/mock-quickstarts/getMockQuickStarts');

// TODO: Don't use local quickstarts
const USE_LOCAL_QUICK_STARTS = true;

// TODO: Retrieve from the correct group for dashboard quickstarts
const quickStartsGroup = 'console.openshift.io';
const quickStartsVersion = 'v1';
const quickStartsPlural = 'consolequickstarts';

const getInstalledQuickStarts = async (fastify) => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const installedQuickStarts = [];
  try {
    const res = await customObjectsApi.listClusterCustomObject(
      quickStartsGroup,
      quickStartsVersion,
      quickStartsPlural,
    );
    installedQuickStarts.push(...res.body.items);
  } catch (e) {
    fastify.log.error(e, 'failed to get quickstarts');
    if (!constants.USE_MOCK_DATA || USE_LOCAL_QUICK_STARTS) {
      const error = createError(500, 'failed to get quickstarts');
      error.explicitInternalServerError = true;
      error.error = 'failed to get quickstarts';
      error.message =
        'Unable to load Kubeflow resources. Please ensure the Open Data Hub operator has been installed.';
      throw error;
    }
  }

  if (USE_LOCAL_QUICK_STARTS || constants.USE_MOCK_DATA) {
    const mockQuickStarts = getMockQuickStarts();
    installedQuickStarts.push(...mockQuickStarts);
  }

  return installedQuickStarts;
};

module.exports = { getInstalledQuickStarts };
