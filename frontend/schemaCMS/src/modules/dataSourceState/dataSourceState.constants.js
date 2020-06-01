import * as Yup from 'yup';

export const CREATE_DATA_SOURCE_STATE_FORM = 'create_project_state_form';
export const DATA_SOURCE_STATE_NAME = 'name';
export const DATA_SOURCE_STATE_DESCRIPTION = 'description';
export const DATA_SOURCE_STATE_SOURCE_URL = 'sourceUrl';
export const DATA_SOURCE_STATE_IS_PUBLIC = 'isPublic';
export const DATA_SOURCE_STATE_AUTHOR = 'author';
export const DATA_SOURCE_STATE_CREATED = 'created';
export const DATA_SOURCE_STATE_FILTERS = 'filters';
export const DATA_SOURCE_STATE_ACTIVE_FILTERS = 'activeFilters';
export const DATA_SOURCE_STATE_FILTER_NAME = 'name';
export const DATA_SOURCE_STATE_FILTER_TYPE = 'filterType';
export const DATA_SOURCE_STATE_FILTER_FIELD = 'field';
export const DATA_SOURCE_STATE_FILTER_VALUES = 'values';
export const DATA_SOURCE_STATE_FILTER_SECONDARY_VALUES = 'secondaryValues';
export const DATA_SOURCE_STATE_TAGS = 'tags';

export const INITIAL_VALUES = {
  [DATA_SOURCE_STATE_NAME]: '',
  [DATA_SOURCE_STATE_DESCRIPTION]: '',
  [DATA_SOURCE_STATE_SOURCE_URL]: '',
  [DATA_SOURCE_STATE_ACTIVE_FILTERS]: [],
  [DATA_SOURCE_STATE_FILTERS]: [],
  [DATA_SOURCE_STATE_TAGS]: {},
  [DATA_SOURCE_STATE_IS_PUBLIC]: false,
};

export const REQUEST_KEYS = [
  DATA_SOURCE_STATE_NAME,
  DATA_SOURCE_STATE_DESCRIPTION,
  DATA_SOURCE_STATE_SOURCE_URL,
  DATA_SOURCE_STATE_FILTERS,
  DATA_SOURCE_STATE_TAGS,
  DATA_SOURCE_STATE_IS_PUBLIC,
];

export const DATA_SOURCE_STATE_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_STATE_NAME]: Yup.string()
    .trim()
    .min(1, 'State name should have at least 1 characters')
    .max(25, 'State name should have maximum 25 characters')
    .required('Required'),
  [DATA_SOURCE_STATE_DESCRIPTION]: Yup.string()
    .trim()
    .max(150, 'State description should have maximum 150 characters'),
  [DATA_SOURCE_STATE_SOURCE_URL]: Yup.string()
    .trim()
    .max(150, 'State source URL should have maximum 150 characters'),
});

export const DATA_SOURCE_STATE_FILTER_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_STATE_FILTER_VALUES]: Yup.array()
    .compact(v => v === '')
    .min(1, 'Required')
    .required('Required'),
});
