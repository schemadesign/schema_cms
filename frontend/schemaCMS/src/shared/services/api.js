import axios from 'axios';
import { camelizeKeys, decamelizeKeys, pascalize } from 'humps';
import {
  __,
  anyPass,
  complement,
  concat,
  endsWith,
  evolve,
  ifElse,
  is,
  map,
  mapObjIndexed,
  not,
  pipe,
  startsWith,
  toLower,
  when,
  isEmpty,
} from 'ramda';
import queryString from 'query-string';

import { AUTH_PATH } from '../utils/api.constants';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

const camelizeErrorCode = fieldName =>
  pipe(
    toLower,
    pascalize,
    concat(fieldName),
    concat(__, 'ServerError')
  );

const extractObjectErrors = pipe(
  camelizeKeys,
  mapObjIndexed((errorCode, fieldName) =>
    ifElse(is(Array), map(camelizeErrorCode(fieldName)), camelizeErrorCode(fieldName))(errorCode)
  )
);

export const camelizeResponseErrors = errors =>
  ifElse(is(Array), map(extractObjectErrors), e => extractObjectErrors(e))(errors);

api.interceptors.request.use(
  evolve({
    url: when(complement(anyPass([endsWith('/'), startsWith('http')])), url => {
      const parsedUrl = queryString.parseUrl(url);
      if (isEmpty(parsedUrl.query)) {
        return parsedUrl.url;
      }

      return `${parsedUrl.url}/?${queryString.stringify(parsedUrl.query)}`;
    }),
    data: when(
      pipe(
        is(FormData),
        not
      ),
      decamelizeKeys
    ),
  }),
  error => Promise.reject(error)
);

api.interceptors.response.use(
  evolve({
    data: camelizeKeys,
  }),
  error => {
    if (error.response.status === 401) {
      return window.location.replace(AUTH_PATH);
    }
    return Promise.reject(error);
  }
);

export default api;
