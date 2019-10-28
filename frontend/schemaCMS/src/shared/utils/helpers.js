import { isEmpty, keys, map } from 'ramda';
import { camelize } from 'humps';

export const generateApiUrl = (slug = '') => (isEmpty(slug) ? '' : `schemacms/api/${slug}`);

export const errorMessageParser = ({ errors, messages, formatMessage }) =>
  errors.reduce((previousValue, { code, name }) => {
    const error = camelize(`${name}_${code}_error`);
    const messageError = messages[error];
    const defaultErrorMessage = 'Something went wrong.';
    const formattedMessageError = messageError ? formatMessage(messageError) : defaultErrorMessage;

    return { [name]: formattedMessageError, ...previousValue };
  }, {});

export const getTableData = (data = []) => {
  const header = keys(data[0]);
  const createArrayValues = data => map(name => data[name], header);
  const rows = map(createArrayValues, data);

  return { header, rows };
};
