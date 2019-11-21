import { either, is, filter, isEmpty, keys, map, not, path, pipe, propEq, propOr } from 'ramda';
import { camelize } from 'humps';
import { JOB_STATE_PENDING, JOB_STATE_PROCESSING } from '../../modules/job/job.constants';

export const generateApiUrl = (slug = '') => (isEmpty(slug) ? '' : `schemacms/api/${slug}`);

export const errorMessageParser = ({ errors, messages, formatMessage }) => {
  if (is(Array, errors)) {
    return errors.reduce((previousValue, { code, name }) => {
      const error = camelize(`${name}_${code}_error`);
      const messageError = messages[error];
      const defaultErrorMessage = 'Something went wrong.';
      const formattedMessageError = messageError ? formatMessage(messageError) : defaultErrorMessage;

      return { [name]: formattedMessageError, ...previousValue };
    }, {});
  }

  return {};
};

export const getTableData = (data = []) => {
  const header = keys(data[0]);
  const createArrayValues = data => map(name => data[name], header);
  const rows = map(createArrayValues, data);

  return { header, rows };
};

export const getIsAnyResultProcessing = pipe(
  propOr([], 'jobs'),
  filter(either(propEq('jobState', JOB_STATE_PENDING), propEq('jobState', JOB_STATE_PROCESSING))),
  isEmpty,
  not
);

export const getError = error => ({
  error: {
    message: path(['response', 'data', 'detail', 'message'], error),
    code: path(['response', 'data', 'detail', 'code'], error),
    status: path(['response', 'status'], error),
  },
});
