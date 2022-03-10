import { FastifyRequest } from 'fastify';
import { KubeFastifyInstance, ClusterSettings } from '../../../types';

export const updateClusterSettings = async (
  fastify: KubeFastifyInstance,
  request: FastifyRequest,
): Promise<ClusterSettings | string> => {
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
    return {
      userTrackingEnabled: query.userTrackingEnabled === 'true',
    };
  } catch (e) {
    if (e.response?.statusCode !== 404) {
      fastify.log.error('Setting cluster settings error: ' + e.toString());
      return 'Unable to update cluster settings.';
    }
  }
};

export const getClusterSettings = async (
  fastify: KubeFastifyInstance,
): Promise<ClusterSettings | string> => {
  const coreV1Api = fastify.kube.coreV1Api;
  const namespace = fastify.kube.namespace;
  try {
    const clusterSettingsRes = await coreV1Api.readNamespacedConfigMap(
      'rhods-segment-key-config',
      namespace,
    );
    return {
      userTrackingEnabled: clusterSettingsRes.body.data.segmentKeyEnabled === 'true',
    };
  } catch (e) {
    if (e.response?.statusCode !== 404) {
      fastify.log.error('Error retrieving segment key enabled: ' + e.toString());
    }
    return 'Unable to retrieve cluster settings.';
  }
};
