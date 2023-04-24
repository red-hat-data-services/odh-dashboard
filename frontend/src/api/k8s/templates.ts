import { k8sListResource, k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { TemplateKind } from '~/k8sTypes';
import { TemplateModel } from '~/api/models';

export const listTemplates = async (
  namespace?: string,
  labelSelector?: string,
): Promise<TemplateKind[]> => {
  const queryOptions = {
    ...(namespace && { ns: namespace }),
    ...(labelSelector && { queryParams: { labelSelector } }),
  };
  return k8sListResource<TemplateKind>({
    model: TemplateModel,
    queryOptions,
  }).then((listResource) => listResource.items);
};

export const toggleTemplateEnabledStatus = (
  name: string,
  namespace: string,
  enable: boolean,
): Promise<TemplateKind> =>
  k8sPatchResource<TemplateKind>({
    model: TemplateModel,
    queryOptions: { name, ns: namespace },
    patches: [
      {
        op: 'replace',
        path: '/metadata/annotations/opendatahub.io~1template-enabled',
        value: enable ? 'true' : 'false',
      },
    ],
  });
