import createError from 'http-errors';
import {
  CSVKind,
  K8sResourceCommon,
  KfDefApplication,
  KfDefResource,
  KubeFastifyInstance,
} from '../types';
import { OdhApplication } from '../gen/io.openshift.console.applications.v1alpha1';
import { OdhDocument } from '../gen/io.openshift.console.documents.v1alpha1';
import { ResourceWatcher } from './resourceWatcher';
import { getComponentFeatureFlags } from './features';

let operatorWatcher: ResourceWatcher<CSVKind>;
let serviceWatcher: ResourceWatcher<K8sResourceCommon>;
let appWatcher: ResourceWatcher<OdhApplication>;
let docWatcher: ResourceWatcher<OdhDocument>;
let kfDefWatcher: ResourceWatcher<KfDefApplication>;

const fetchInstalledOperators = (fastify: KubeFastifyInstance): Promise<CSVKind[]> => {
  return fastify.kube.customObjectsApi
    .listNamespacedCustomObject('operators.coreos.com', 'v1alpha1', '', 'clusterserviceversions')
    .then((res) => {
      const csvs = (res?.body as { items: CSVKind[] })?.items;
      if (csvs?.length > 0) {
        return csvs.reduce((acc, csv) => {
          if (csv.status?.phase === 'Succeeded' && csv.status?.reason === 'InstallSucceeded') {
            acc.push(csv);
          }
          return acc;
        }, []);
      }
      return [];
    })
    .catch((e) => {
      console.error(e, 'failed to get ClusterServiceVersions');
      return [];
    });
};

const fetchServices = (fastify: KubeFastifyInstance) => {
  return fastify.kube.coreV1Api
    .listServiceForAllNamespaces()
    .then((res) => {
      return res?.body?.items;
    })
    .catch((e) => {
      console.error(e, 'failed to get Services');
      return [];
    });
};

const fetchInstalledKfdefs = async (fastify: KubeFastifyInstance): Promise<KfDefApplication[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;

  let kfdef: KfDefResource;
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'kfdef.apps.kubeflow.org',
      'v1',
      namespace,
      'kfdefs',
    );
    kfdef = (res?.body as { items: KfDefResource[] })?.items?.[0];
  } catch (e) {
    fastify.log.error(e, 'failed to get kfdefs');
    const error = createError(500, 'failed to get kfdefs');
    error.explicitInternalServerError = true;
    error.error = 'failed to get kfdefs';
    error.message =
      'Unable to load Kubeflow resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }

  return kfdef?.spec?.applications || [];
};

const fetchOdhApplications = async (fastify: KubeFastifyInstance): Promise<OdhApplication[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;
  const featureFlags = getComponentFeatureFlags();

  let odhApplications: OdhApplication[];
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'applications.console.openshift.io',
      'v1alpha1',
      namespace,
      'odhapplications',
    );
    const cas = (res?.body as { items: OdhApplication[] })?.items;
    odhApplications = cas.reduce((acc, ca) => {
      if (!ca.spec.featureFlag || featureFlags[ca.spec.featureFlag]) {
        acc.push(ca);
      }
      return acc;
    }, []);
  } catch (e) {
    fastify.log.error(e, 'failed to get odhapplications');
    const error = createError(500, 'failed to get odhapplications');
    error.explicitInternalServerError = true;
    error.error = 'failed to get odhapplications';
    error.message =
      'Unable to get OdhApplication resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }
  return Promise.resolve(odhApplications);
};

const fetchOdhDocuments = async (fastify: KubeFastifyInstance): Promise<OdhDocument[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;
  const featureFlags = getComponentFeatureFlags();
  const appDefs = await fetchOdhApplications(fastify);

  let odhDocuments: OdhDocument[];
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'documents.console.openshift.io',
      'v1alpha1',
      namespace,
      'odhdocuments',
    );
    const cas = (res?.body as { items: OdhDocument[] })?.items;
    if (cas?.length > 0) {
      odhDocuments = cas.reduce((acc, cd) => {
        if (cd.spec.featureFlag) {
          if (featureFlags[cd.spec.featureFlag]) {
            acc.push(cd);
          }
        } else if (!cd.spec.appName || appDefs.find((def) => def.metadata.name === cd.spec.appName)) {
          acc.push(cd);
        } else if (!cd.spec.featureFlag || featureFlags[cd.spec.featureFlag]) {
          acc.push(cd);
        }
        return acc;
      }, []);
    }
  } catch (e) {
    fastify.log.error(e, 'failed to get odhdocuments');
    const error = createError(500, 'failed to get odhdocuments');
    error.explicitInternalServerError = true;
    error.error = 'failed to get odhdocuments';
    error.message =
      'Unable to get OdhDocument resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }
  return Promise.resolve(odhDocuments);
};

export const initializeWatchedResources = (fastify: KubeFastifyInstance): void => {
  operatorWatcher = new ResourceWatcher<CSVKind>(fastify, fetchInstalledOperators);
  serviceWatcher = new ResourceWatcher<K8sResourceCommon>(fastify, fetchServices);
  kfDefWatcher = new ResourceWatcher<KfDefApplication>(fastify, fetchInstalledKfdefs);
  appWatcher = new ResourceWatcher<OdhApplication>(fastify, fetchOdhApplications);
  docWatcher = new ResourceWatcher<OdhDocument>(fastify, fetchOdhDocuments);
};

export const getInstalledOperators = (): K8sResourceCommon[] => {
  return operatorWatcher.getResources();
};

export const getServices = (): K8sResourceCommon[] => {
  return serviceWatcher.getResources();
};

export const getInstalledKfdefs = (): KfDefApplication[] => {
  return kfDefWatcher.getResources();
};

export const getApplicationDefs = (): OdhApplication[] => {
  return appWatcher.getResources();
};

export const getApplicationDef = (appName: string): OdhApplication => {
  const appDefs = getApplicationDefs();
  return appDefs.find((appDef) => appDef.metadata.name === appName);
};

export const getDocs = (): OdhDocument[] => {
  return docWatcher.getResources();
};
