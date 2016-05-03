import { fetch } from 'app/utils';

export const API_FETCH = 'bar/API_FETCH';

const fetchBar = async () => {
  const { data } = await fetch.get('/api/bar');
  return data;
};

export const apiFetch = () => ({
  type: API_FETCH,
  payload: {
    promise: fetchBar(),
  },
});
