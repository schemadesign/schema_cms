import * as Yup from 'yup';

export const FILTER_NAME = 'filter_name';
export const FILTER_TYPE = 'filter_type';
export const FILTER_FIELD = 'filter_field';
export const FILTER_FIELD_TYPE = 'filter_field_type';
export const FILTER_UNIQUE_ITEMS = 'filter_unique_items';

export const INITIAL_VALUES = {
  [FILTER_NAME]: '',
  [FILTER_TYPE]: '',
  [FILTER_FIELD]: '',
  [FILTER_FIELD_TYPE]: '',
  [FILTER_FIELD_TYPE]: '',
  [FILTER_UNIQUE_ITEMS]: '',
};

export const PROJECT_SCHEMA = Yup.object().shape({
  [FILTER_NAME]: Yup.string()
    .min(3, 'Project Name should have at least 3 characters')
    .max(50, 'Project Name should have maximum 50 characters')
    .required('Required'),
  [FILTER_TYPE]: Yup.string().required('Required'),
  [FILTER_FIELD]: Yup.string().required('Required'),
  [FILTER_FIELD_TYPE]: Yup.string().required('Required'),
});
