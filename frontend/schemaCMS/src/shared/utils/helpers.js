import {
  complement,
  either,
  filter,
  forEach,
  includes,
  is,
  isEmpty,
  isNil,
  keys,
  map,
  path,
  pathOr,
  pickBy,
  pipe,
  propOr,
} from 'ramda';
import { camelize, decamelize } from 'humps';
import queryString from 'query-string';
import debounce from 'lodash.debounce';
import { sizes } from '../../theme/media';
import { META_PENDING, META_PROCESSING } from '../../modules/dataSource/dataSource.constants';
import { JOB_STATE_PENDING, JOB_STATE_PROCESSING } from '../../modules/job/job.constants';

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

export const getEventFiles = data => pathOr(data, ['currentTarget', 'files'])(data);

export const getQueryParams = pipe(
  pathOr('', ['location', 'search']),
  queryString.parse
);

const byRole = userRole => item => includes(userRole, item.allowedRoles);

export const filterMenuOptions = (options, userRole) => filter(byRole(userRole))(options);

export const handleToggleMenu = (that, isDesktop) => {
  const handleResize = debounce(e => {
    const { innerWidth } = e.target;
    const sizeBreakpoint = isDesktop ? innerWidth < sizes.desktop : innerWidth >= sizes.desktop;

    if (sizeBreakpoint && innerWidth !== that.oldWidth) {
      that.oldWidth = innerWidth;
      document.body.style.overflow = 'auto';
      that.setState({ isMenuOpen: false });
    }
  }, 500);

  const isMenuOpen = !that.state.isMenuOpen;
  const eventListener = isMenuOpen ? 'addEventListener' : 'removeEventListener';

  document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  that.oldWidth = window.innerWidth;
  window[eventListener]('resize', handleResize);

  that.setState({ isMenuOpen });
};

export const isProcessingData = ({ metaData, jobsState }) => {
  const metaStatus = propOr('', 'status', metaData);
  const lastJobStatus = propOr('', 'lastJobStatus', jobsState);
  const metaProcessing = [META_PENDING, META_PROCESSING].includes(metaStatus);
  const jobProcessing = [JOB_STATE_PENDING, JOB_STATE_PROCESSING].includes(lastJobStatus);

  return { isProcessing: metaProcessing || jobProcessing, metaProcessing, jobProcessing };
};
