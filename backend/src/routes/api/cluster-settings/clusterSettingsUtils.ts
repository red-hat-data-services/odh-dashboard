import { FastifyRequest } from 'fastify';
import { KubeFastifyInstance, ClusterSettings } from '../../../types';

export const updateClusterSettings = async (
  fastify: KubeFastifyInstance,
  request: FastifyRequest,
): Promise<{ success: boolean; error: string }> => {
  const coreV1Api = fastify.kube.coreV1Api;
  const namespace = fastify.kube.namespace;
  const query = request.query as { [key: string]: string };
  try {
    if (query.userTrackingEnabled) {
      await coreV1Api.patchNamespacedConfigMap(
        'rhods-segment-key-config',
        namespace,
        {
          data: { segmentKeyEnabled: query.userTrackingEnabled },
        },
        undefined,
        undefined,
        undefined,
        undefined,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        },
      );
    }
    if (query.pvcSize) {
      await coreV1Api.patchNamespacedConfigMap(
        'jupyterhub-cfg',
        namespace,
        {
          data: { singleuser_pvc_size: `${query.pvcSize}Gi` },
        },
        undefined,
        undefined,
        undefined,
        undefined,
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        },
      );
    }
    return { success: true, error: null };
  } catch (e) {
    if (e.response?.statusCode !== 404) {
      fastify.log.error('Setting cluster settings error: ' + e.toString());
      return { success: false, error: 'Unable to update cluster settings. ' + e.message };
    }
  }
};

export const getClusterSettings = async (
  fastify: KubeFastifyInstance,
): Promise<ClusterSettings | string> => {
  const coreV1Api = fastify.kube.coreV1Api;
  const namespace = fastify.kube.namespace;
  try {
    const segmentEnabledRes = await coreV1Api.readNamespacedConfigMap(
      'rhods-segment-key-config',
      namespace,
    );
    const pvcResponse = await coreV1Api.readNamespacedConfigMap('jupyterhub-cfg', namespace);
    return {
      pvcSize: Number(pvcResponse.body.data.singleuser_pvc_size.replace('Gi', '')),
      userTrackingEnabled: segmentEnabledRes.body.data.segmentKeyEnabled === 'true',
    };
  } catch (e) {
    if (e.response?.statusCode !== 404) {
      fastify.log.error('Error retrieving cluster settings: ' + e.toString());
    }
    return 'Unable to retrieve cluster settings.';
  }
};
