import { KubeFastifyInstance, ODHSegmentKey } from '../../../types';

export const getSegmentKey = async (fastify: KubeFastifyInstance): Promise<ODHSegmentKey> => {
  const coreV1Api = fastify.kube.coreV1Api;
  const namespace = fastify.kube.namespace;
  let segmentKeyEnabled = true;
  let decodedSegmentKey = '';
  try {
    const resEnabled = await coreV1Api.readNamespacedConfigMap(
      'rhods-segment-key-config',
      namespace,
    );
    segmentKeyEnabled = resEnabled?.body.data?.segmentKeyEnabled === 'true';
    if (segmentKeyEnabled) {
      const res = await coreV1Api.readNamespacedSecret('rhods-segment-key', namespace);
      decodedSegmentKey = Buffer.from(res.body.data.segmentKey, 'base64').toString();
    }
    return {
      segmentKey: decodedSegmentKey,
    };
  } catch (e) {
    if (segmentKeyEnabled && e.response?.statusCode !== 404) {
      fastify.log.error('load segment key error: ' + e);
    }
    return {
      segmentKey: '',
    };
  }
};
