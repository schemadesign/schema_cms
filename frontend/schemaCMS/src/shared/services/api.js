import axios from 'axios';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import { camelizeKeys, decamelizeKeys, pascalize } from 'humps';
import {
  __,
  always,
  anyPass,
  complement,
  concat,
  cond,
  endsWith,
  equals,
  evolve,
  ifElse,
  is,
  isEmpty,
  keys,
  map,
  mapObjIndexed,
  not,
  path,
  pathOr,
  pipe,
  propIs,
  startsWith,
  T,
  toLower,
  when,
} from 'ramda';
import queryString from 'query-string';
import browserHistory from '../utils/history';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  camelize: true,
});

const camelizeErrorCode = fieldName => pipe(toLower, pascalize, concat(fieldName), concat(__, 'ServerError'));

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

      return `${parsedUrl.url}?${queryString.stringify(parsedUrl.query)}`;
    }),
    data: when(pipe(is(FormData), not), decamelizeKeys),
  }),
  error => Promise.reject(error)
);

const getData = path(['response', 'data']);

const getCode = name => pipe(getData, ifElse(propIs(Array, name), path([name, 0, 'code']), path([name, 'code'])));

const convertResponseErrors = error =>
  pipe(
    getData,
    keys,
    map(name => ({ code: getCode(name)(error), name }))
  )(error);

const getRedirectUrl = cond([
  [equals(UNAUTHORIZED), always('/logout')],
  [equals(FORBIDDEN), always('/not-authorized')],
  [equals(NOT_FOUND), always('/not-found')],
  [T, always(null)],
]);

api.interceptors.response.use(
  response => {
    if (response.config.camelize) {
      return evolve({
        data: camelizeKeys,
      })(response);
    }
    return response;
  },
  error => {
    const status = pathOr('', ['response', 'status'])(error);
    const url = getRedirectUrl(status);

    if (url) {
      browserHistory.push(url);
    }

    if (error.response.status === BAD_REQUEST) {
      return Promise.reject(convertResponseErrors(error));
    }

    return Promise.reject(error);
  }
);

export default api;
