import * as Yup from 'yup';

export const CREATE_PROJECT_STATE_FORM = 'create_project_state_form';
export const PROJECT_STATE_NAME = 'name';
export const PROJECT_STATE_DESCRIPTION = 'description';
export const PROJECT_STATE_DATA_SOURCE = 'datasource';
export const PROJECT_STATE_SOURCE_URL = 'sourceUrl';
export const PROJECT_STATE_IS_PUBLIC = 'isPublic';
export const PROJECT_STATE_AUTHOR = 'author';
export const PROJECT_STATE_CREATED = 'created';
export const PROJECT_STATE_FILTERS = 'filters';

export const INITIAL_VALUES = {
  [PROJECT_STATE_NAME]: '',
  [PROJECT_STATE_DESCRIPTION]: '',
  [PROJECT_STATE_DATA_SOURCE]: '',
  [PROJECT_STATE_SOURCE_URL]: '',
  [PROJECT_STATE_IS_PUBLIC]: false,
};

export const PROJECT_STATE_SCHEMA = Yup.object().shape({
  [PROJECT_STATE_NAME]: Yup.string()
    .trim()
    .min(1, 'State name should have at least 1 characters')
    .max(25, 'State name should have maximum 25 characters')
    .required('Required'),
  [PROJECT_STATE_DESCRIPTION]: Yup.string()
    .trim()
    .max(150, 'State description should have maximum 150 characters'),
  [PROJECT_STATE_SOURCE_URL]: Yup.string()
    .trim()
    .max(150, 'State source URL should have maximum 150 characters'),
  [PROJECT_STATE_DATA_SOURCE]: Yup.string().required('Required'),
});
