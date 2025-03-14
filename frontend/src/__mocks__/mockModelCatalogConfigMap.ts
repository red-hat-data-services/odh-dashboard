import type { ConfigMapKind } from '~/k8sTypes';
import { ModelCatalogSourcesObject } from '~/concepts/modelCatalog/types';
import { mockConfigMap } from './mockConfigMap';
import { mockModelCatalogSource } from './mockModelCatalogSource';

export const mockModelCatalogConfigMap = (): ConfigMapKind => {
  const sourcesObj: ModelCatalogSourcesObject = {
    sources: [mockModelCatalogSource({})],
  };
  return mockConfigMap({
    name: 'model-catalog-sources',
    namespace: 'opendatahub',
    data: {
      modelCatalogSources: JSON.stringify(sourcesObj),
    },
  });
};
