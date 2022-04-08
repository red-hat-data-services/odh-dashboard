import { FastifyRequest } from 'fastify';
import { scaleDeploymentConfig } from '../../../utils/deployment';
import { KubeFastifyInstance, ClusterSettings } from '../../../types';

const juypterhubCfg = 'jupyterhub-cfg';
const segmentKeyCfg = 'rhods-segment-key-config';

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
        segmentKeyCfg,
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
    const jupyterhubCM = await coreV1Api.readNamespacedConfigMap(juypterhubCfg, namespace);
    if (query.pvcSize) {
      await coreV1Api.patchNamespacedConfigMap(
        juypterhubCfg,
        namespace,
        {
          data: { singleuser_pvc_size: `${query.pvcSize}Gi`, culler_timeout: query.cullerTimeout },
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
      if (jupyterhubCM.body.data.singleuser_pvc_size.replace('Gi', '') !== query.pvcSize) {
        await scaleDeploymentConfig(fastify, 'jupyterhub', 0);
      }
      if (jupyterhubCM.body.data['culler_timeout'] !== query.cullerTimeout) {
        // scale down to 0 and scale it up to 1
        await scaleDeploymentConfig(fastify, 'jupyterhub-idle-culler', 0);
        await scaleDeploymentConfig(fastify, 'jupyterhub-idle-culler', 1);
      }
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
    const segmentEnabledRes = await coreV1Api.readNamespacedConfigMap(segmentKeyCfg, namespace);
    const pvcResponse = await coreV1Api.readNamespacedConfigMap(juypterhubCfg, namespace);

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
