/**
 * Gets entity count and returns it
 *
 * @param {string} routeUrl - The Feature Store route URL
 * @param {string} project - The project name
 * @returns {Cypress.Chainable<number>} The entity count
 */
export const getEntityCount = (routeUrl: string, project: string): Cypress.Chainable<number> => {
  const apiUrl = `${routeUrl}/api/v1/entities?project=${project}&allow_cache=true&include_relationships=false`;

  return cy
    .request({
      method: 'GET',
      url: apiUrl,
      headers: { accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200 || !response.body || !('entities' in response.body)) {
        throw new Error(`Failed to get entity count: ${response.status}`);
      }
      const count = response.body.entities.length;
      cy.log(`Entity count: ${count}`);
      return cy.wrap<number>(count); // Wrap the return value with proper typing
    });
};

/**
 * Gets feature count  and returns it
 *
 * @param {string} routeUrl - The Feature Store route URL
 * @param {string} project - The project name
 * @returns {Cypress.Chainable<number>} The feature count
 */
export const getFeatureCount = (routeUrl: string, project: string): Cypress.Chainable<number> => {
  const apiUrl = `${routeUrl}/api/v1/features?project=${project}&include_relationships=false&allow_cache=true`;

  return cy
    .request({
      method: 'GET',
      url: apiUrl,
      headers: { accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200 || !response.body || !('features' in response.body)) {
        throw new Error(`Failed to get feature count: ${response.status}`);
      }
      const count = response.body.features.length;
      cy.log(`Feature count: ${count}`);
      return cy.wrap<number>(count); // Wrap the return value with proper typing
    });
};

/**
 * Gets feature view count and returns it
 *
 * @param {string} routeUrl - The Feature Store route URL
 * @param {string} project - The project name
 * @returns {Cypress.Chainable<number>} The feature view count
 */
export const getFeatureViewCount = (
  routeUrl: string,
  project: string,
): Cypress.Chainable<number> => {
  const apiUrl = `${routeUrl}/api/v1/feature_views?project=${project}&allow_cache=true&include_relationships=false`;

  return cy
    .request({
      method: 'GET',
      url: apiUrl,
      headers: { accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200 || !response.body || !('featureViews' in response.body)) {
        throw new Error(`Failed to get feature view count: ${response.status}`);
      }
      const count = response.body.featureViews.length;
      cy.log(`Feature view count: ${count}`);
      return cy.wrap<number>(count);
    });
};

/**
 * Gets feature service count and returns it
 *
 * @param {string} routeUrl - The Feature Store route URL
 * @param {string} project - The project name
 * @returns {Cypress.Chainable<number>} The feature service count
 */
export const getFeatureServicesCount = (
  routeUrl: string,
  project: string,
): Cypress.Chainable<number> => {
  const apiUrl = `${routeUrl}/api/v1/feature_services?project=${project}&include_relationships=false&allow_cache=true`;

  return cy
    .request({
      method: 'GET',
      url: apiUrl,
      headers: { accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200 || !response.body || !('featureServices' in response.body)) {
        throw new Error(`Failed to get feature service count: ${response.status}`);
      }
      const count = response.body.featureServices.length;
      cy.log(`Feature service count: ${count}`);
      return cy.wrap<number>(count);
    });
};

/**
 * Gets data source count and returns it
 *
 * @param {string} routeUrl - The Feature Store route URL
 * @param {string} project - The project name
 * @returns {Cypress.Chainable<number>} The data source count
 */
export const getDataSourceCount = (
  routeUrl: string,
  project: string,
): Cypress.Chainable<number> => {
  const apiUrl = `${routeUrl}/api/v1/data_sources?project=${project}&include_relationships=false&allow_cache=true`;

  return cy
    .request({
      method: 'GET',
      url: apiUrl,
      headers: { accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200 || !response.body || !('dataSources' in response.body)) {
        throw new Error(`Failed to get data source count: ${response.status}`);
      }
      const count = response.body.dataSources.length;
      cy.log(`Data source count: ${count}`);
      return cy.wrap<number>(count);
    });
};

/**
 * Gets saved dataset count and returns it
 *
 * @param {string} routeUrl - The Feature Store route URL
 * @param {string} project - The project name
 * @returns {Cypress.Chainable<number>} The saved dataset count
 */
export const getDatasetsCount = (routeUrl: string, project: string): Cypress.Chainable<number> => {
  const apiUrl = `${routeUrl}/api/v1/saved_datasets?project=${project}&allow_cache=true&include_relationships=false`;

  return cy
    .request({
      method: 'GET',
      url: apiUrl,
      headers: { accept: 'application/json' },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200 || !response.body || !('savedDatasets' in response.body)) {
        throw new Error(`Failed to get dataset count: ${response.status}`);
      }
      const count = response.body.savedDatasets.length;
      cy.log(`Saved dataset count: ${count}`);
      return cy.wrap<number>(count);
    });
};

/**
 * Fetches all Feature Store counts in a single function call
 * @param {string} routeUrl - The route URL for the API
 * @param {string} project - The project name
 * @returns {Cypress.Chainable<object>} Object containing all counts
 */
export const getAllFeatureStoreCounts = (
  routeUrl: string,
  project: string,
): Cypress.Chainable<{
  featureCount: number;
  entityCount: number;
  datasetCount: number;
  dataSourceCount: number;
  featureViewCount: number;
  featureServiceCount: number;
}> => {
  return getFeatureCount(routeUrl, project).then((featuresCount) => {
    return getEntityCount(routeUrl, project).then((entitiesCount) => {
      return getDatasetsCount(routeUrl, project).then((datasetsCount) => {
        return getDataSourceCount(routeUrl, project).then((dataSourcesCount) => {
          return getFeatureViewCount(routeUrl, project).then((featureViewsCount) => {
            return getFeatureServicesCount(routeUrl, project).then((featureServicesCount) => {
              const allCounts = {
                featureCount: featuresCount,
                entityCount: entitiesCount,
                datasetCount: datasetsCount,
                dataSourceCount: dataSourcesCount,
                featureViewCount: featureViewsCount,
                featureServiceCount: featureServicesCount,
              };

              cy.log('All Feature Store counts fetched:', allCounts);
              return cy.wrap(allCounts);
            });
          });
        });
      });
    });
  });
};
