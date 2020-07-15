import {
  addIndex,
  always,
  assoc,
  complement,
  cond,
  either,
  equals,
  evolve,
  filter,
  forEach,
  identity,
  ifElse,
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
  T,
  mergeRight,
  flatten,
  concat,
  propEq,
  both,
  prop,
  defaultTo,
  groupBy,
  find,
  pick,
  toPairs,
} from 'ramda';
import { camelize, decamelize } from 'humps';
import { parse } from 'query-string';
import debounce from 'lodash.debounce';
import { sizes } from '../../theme/media';
import { META_PENDING, META_PROCESSING } from '../../modules/dataSource/dataSource.constants';
import { JOB_STATE_PENDING, JOB_STATE_PROCESSING } from '../../modules/job/job.constants';
import { BLOCK_ELEMENTS, PAGE_BLOCKS, PAGE_TAGS, PAGE_TEMPLATE } from '../../modules/page/page.constants';
import {
  CUSTOM_ELEMENT_TYPE,
  ELEMENT_VALUE,
  IMAGE_TYPE,
  FILE_TYPE,
  OBSERVABLE_CELL,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_PARAMS,
  OBSERVABLE_USER,
  OBSERVABLEHQ_TYPE,
  STATE_TYPE,
} from '../../modules/blockTemplates/blockTemplates.constants';
import {
  DATA_SOURCE_STATE_ACTIVE_FILTERS,
  DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES,
  DATA_SOURCE_STATE_FILTERS,
  DATA_SOURCE_STATE_TAGS,
} from '../../modules/dataSourceState/dataSourceState.constants';
import { FILTER_TYPE_RANGE, FILTER_TYPE_BOOL } from '../../modules/filter/filter.constants';

export const ASCENDING = 'ascending';
export const DESCENDING = 'descending';

export const generateApiUrl = (slug = '') => (isEmpty(slug) ? '' : `schemacms/api/${slug}`);
export const addOrder = (item, index) => assoc('order', index, item);
export const mapIndexed = addIndex(map);
export const mapAndAddOrder = mapIndexed(addOrder);

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
  parse
);

const byRole = userRole => item => includes(userRole, item.allowedRoles);

export const filterMenuOptions = (options, userRole) => filter(byRole(userRole))(options);

export const handleToggleMenu = (that, isDesktop) => {
  const handleResize = debounce(e => {
    const { innerWidth } = e.target;
    const sizeBreakpoint = isDesktop ? innerWidth < sizes.desktop : innerWidth >= sizes.desktop;

    if (sizeBreakpoint && innerWidth !== that.oldWidth) {
      that.oldWidth = innerWidth;
      document.documentElement.classList.remove('hideScroll');
      that.setState({ isMenuOpen: false });
    }
  }, 500);

  const isMenuOpen = !that.state.isMenuOpen;
  const eventListener = isMenuOpen ? 'addEventListener' : 'removeEventListener';

  const classFunc = isMenuOpen ? 'add' : 'remove';
  document.documentElement.classList[classFunc]('hideScroll');
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

export const formatTags = data =>
  pipe(
    keys,
    map(key => map(({ value }) => ({ category: parseInt(key, 10), value }))(data[key] || [])),
    flatten
  )(data);

export const prepareTags = pipe(
  defaultTo([]),
  map(item => ({ ...item, label: item.value })),
  groupBy(prop('category'))
);

export const prepareForPostingPageData = evolve({
  [PAGE_TEMPLATE]: ifElse(equals(0), always(null), identity),
  [PAGE_BLOCKS]: mapAndAddOrder,
  [PAGE_TAGS]: formatTags,
});

export const getValuePath = ({ blockPath, index, elementValue = ELEMENT_VALUE }) =>
  `${blockPath}.${BLOCK_ELEMENTS}.${index}.${elementValue}`;

const getDefaultValue = cond([
  [equals(IMAGE_TYPE), always({})],
  [equals(FILE_TYPE), always({})],
  [equals(STATE_TYPE), always(null)],
  [equals(CUSTOM_ELEMENT_TYPE), always([])],
  [
    equals(OBSERVABLEHQ_TYPE),
    always({
      [OBSERVABLE_USER]: '',
      [OBSERVABLE_NOTEBOOK]: '',
      [OBSERVABLE_CELL]: '',
      [OBSERVABLE_PARAMS]: '',
    }),
  ],
  [T, always('')],
]);

export const setDefaultValue = element => mergeRight(element, { value: getDefaultValue(element.type) });

const ifMainPage = (then, otherwise) => ({ mainPage, id }) =>
  ifElse(both(complement(isNil), complement(propEq('id', id))), then, otherwise)(mainPage);

const getMainPageDisplayName = ({ mainPage, id }) =>
  ifMainPage(
    pipe(
      prop('displayName'),
      concat('/')
    ),
    always('')
  )({ mainPage, id });

export const getPageUrlOptions = ({ internalConnections, domain = '', pageId }) =>
  pipe(
    map(
      pipe(
        evolve({
          pages: filter(complement(propEq('id', pageId))),
        }),
        ({ mainPage, pages, name: sectionName }) =>
          map(({ displayName, name, id, isDraft }) => ({
            url: `${domain + getMainPageDisplayName({ mainPage, id })}/${displayName}`,
            label: ifMainPage(
              () => [{ name: sectionName }, mainPage.name, { name, isDraft }],
              always([{ name: sectionName }, { name, isDraft }])
            )({
              mainPage,
              id,
            }),
            id,
          }))(pages)
      )
    ),
    flatten
  )(internalConnections);

export const getInitialStateFilterValue = ({ filter, state, filterId, fieldsInfo }) => {
  const { values } = pipe(
    propOr([], DATA_SOURCE_STATE_FILTERS),
    find(propEq('filter', filterId)),
    defaultTo({ values: [] }),
    pick(['values'])
  )(state);

  if (FILTER_TYPE_RANGE === filter.filterType) {
    const data = { range: [] };
    if (fieldsInfo.length) {
      const [min, max] = fieldsInfo;
      data.range = [parseInt(min, 10), parseInt(max % 1 ? max + 1 : max, 10)];
    }

    if (values.length) {
      data.values = values;
      data[DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES] = values;
    } else {
      data.values = data.range;
      data[DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES] = data.range;
    }

    return data;
  }

  if (FILTER_TYPE_BOOL === filter.filterType) {
    return { values: isEmpty(values) ? false : values, range: [], [DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES]: [] };
  }

  return { values, range: [], [DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES]: [] };
};

export const getStateInitialValues = state => ({
  ...state,
  [DATA_SOURCE_STATE_TAGS]: either(is(Array), isNil)(state[DATA_SOURCE_STATE_TAGS])
    ? prepareTags(state[DATA_SOURCE_STATE_TAGS])
    : state[DATA_SOURCE_STATE_TAGS],
  [DATA_SOURCE_STATE_ACTIVE_FILTERS]: state[DATA_SOURCE_STATE_FILTERS].map(({ filter }) => filter),
});

export const getTagCategories = pipe(
  groupBy(prop('categoryName')),
  toPairs,
  map(([name, tags]) => ({ name, id: tags[0].category, tags }))
);

export const getUrlParams = history => {
  const search = pathOr({}, ['location', 'search'], history);
  const { sortBy, sortDirection, ...restParams } = parse(search);
  const params = { ...restParams };

  if (sortBy) {
    const isAscending = sortDirection === ASCENDING;
    params.ordering = isAscending ? sortBy : `-${sortBy}`;
  }

  return params;
};

export const getPropsWhenNotEmpty = (values, props) => ifElse(isEmpty, always({}), always(props))(values);
