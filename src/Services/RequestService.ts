import originalFetch from 'isomorphic-fetch';
import fetchRetry from 'fetch-retry';
import { AuthorizationService } from './AuthService';
import { Environments } from '../Environments';

const MAX_RETRIES = 3;
const EXPONENTIAL_BACK_OFF = 1.5;

const fetch = fetchRetry(originalFetch);

const getHeaders = (): Headers => {
  const token = AuthorizationService.getToken();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer ' + token);
  return headers;
};

type RequestFunction = (
  url: string,
  data: object,
  headers?: Headers,
) => Promise<unknown>

export interface RequestServiceType {
  postFormData: RequestFunction;
  post: RequestFunction;
  get: (url: string, headers: Headers) => Promise<unknown>;
  put: RequestFunction;
  patch: RequestFunction;
  delete: RequestFunction;
}

const makeRequest = (path: string, options: object, headers?: Headers) => {
  const retry = {};

  return new Promise(async (resolve, reject) => {
    const url = path.startsWith('http') ? (path) : `${Environments.remoteUrl}${path}`;
    fetch(url, {
      ...options,
      retryOn: (attempt, error, response) => {
        if (attempt === MAX_RETRIES) {
          return false;
        }
        if (!response) {
          return true;
        }
        if (error !== null || response.status >= 500) {
          return true;
        }
        return true;
      },
      retryDelay: attempt => {
        return Math.pow(EXPONENTIAL_BACK_OFF, attempt) * 100;
      },
      credentials: 'same-origin',
      headers: headers || getHeaders(),
    })
      .then(async response => {
        const { ok, status } = response;
        const statusWithEmptyBody = [204, 205];
        if (statusWithEmptyBody.includes(status)) {
          return resolve({ status });
        }
        const responseJson = await response.json();
        if (
          response.status === 401 &&
          ['Invalid Token', 'Unauthorized'].includes(responseJson.message)
        ) {
          AuthorizationService.logout();
          return;
        }
        if (ok) {
          const res = responseJson;
          res.httpStatus = status;
          res.httpCode = status;
          return resolve(res);
        }
        return reject(responseJson);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const RequestService: RequestServiceType = {
  postFormData: (url, data) => {
    const headers = getHeaders();
    headers.delete('Content-Type');
    return makeRequest(
      url,
      {
        body: data,
        method: 'POST',
      },
      headers,
    );
  },
  post: (url, data, headers) => {
    return makeRequest(
      url,
      {
        body: JSON.stringify(data),
        method: 'POST',
      },
      headers,
    );
  },
  put: (url, data) => {
    return makeRequest(url, {
      body: JSON.stringify(data),
      method: 'PUT',
    });
  },
  patch: (url, data) => {
    return makeRequest(url, {
      body: JSON.stringify(data),
      method: 'PATCH',
    });
  },
  get: (url, headers) => {
    return makeRequest(
      url,
      {
        method: 'GET',
      },
      headers,
    );
  },
  delete: (url, data = {}) => {
    return makeRequest(url, {
      body: JSON.stringify(data),
      method: 'DELETE',
    });
  },
};
