import axios from 'axios';
import { getBackendURL } from '../utilities/utils';
import { ODHAppType } from '../types';

export const fetchComponents = (installed: boolean): Promise<ODHAppType[]> => {
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
