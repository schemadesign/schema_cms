import { complement, either, forEach, is, isEmpty, isNil, keys, map, path, pickBy, pipe } from 'ramda';
import { camelize, decamelize } from 'humps';

export const generateApiUrl = (slug = '') => (isEmpty(slug) ? '' : `schemacms/api/${slug}`);

export const errorMessageParser = ({ errors, messages = {}, formatMessage = () => {} }) => {
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

export const getMatchParam = (props, param) => path(['match', 'params', param])(props);

export const formatFormData = data => {
  const formData = new FormData();
  pipe(
    pickBy(complement(either(isNil, isEmpty))),
    keys,
    map(decamelize),
    forEach(name => formData.append(name, data[camelize(name)]))
  )(data);

  return formData;
};
