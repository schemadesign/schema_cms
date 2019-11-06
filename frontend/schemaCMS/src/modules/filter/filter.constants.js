import * as Yup from 'yup';

export const FILTER_NAME = 'filter_name';
export const FILTER_TYPE = 'filter_type';
export const FILTER_FIELD = 'filter_field';
export const FILTER_FIELD_TYPE = 'type';
export const FILTER_UNIQUE_ITEMS = 'filter_unique_items';

export const INITIAL_VALUES = {
  [FILTER_NAME]: '',
  [FILTER_TYPE]: '',
  [FILTER_FIELD]: '',
};

export const FILTERS_SCHEMA = Yup.object().shape({
  [FILTER_NAME]: Yup.string()
    .min(3, 'Filter name should have at least 3 characters')
    .max(50, 'Project Name should have maximum 50 characters')
    .required('Required'),
  [FILTER_TYPE]: Yup.string()
    .min(3, 'Filter type should have at least 3 characters')
    .max(50, 'Filter type should have maximum 50 characters')
    .required('Required'),
  [FILTER_FIELD]: Yup.string()
    .min(1, 'Select field')
    .required('Required'),
});
