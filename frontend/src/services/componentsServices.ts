import axios from 'axios';
import { OdhApplication } from '../gen/io.openshift.console.applications.v1alpha1';
import { getBackendURL } from '../utilities/utils';

export const fetchComponents = (installed: boolean): Promise<OdhApplication[]> => {
  const url = getBackendURL('/api/components');
  const searchParams = new URLSearchParams();
  if (installed) {
    searchParams.set('installed', 'true');
  }
  const options = { params: searchParams };
  return axios
    .get(url, options)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.message);
    });
};
