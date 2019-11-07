import * as Yup from 'yup';

export const FILTER_NAME = 'name';
export const FILTER_TYPE = 'filterType';
export const FILTER_FIELD = 'field';
export const FILTER_FIELD_TYPE = 'fieldType';
export const FILTER_UNIQUE_ITEMS = 'unique';

export const INITIAL_VALUES = {
  [FILTER_NAME]: '',
  [FILTER_TYPE]: '',
  [FILTER_FIELD]: '',
  [FILTER_FIELD_TYPE]: '',
  [FILTER_UNIQUE_ITEMS]: '',
};

export const FILTERS_SCHEMA = Yup.object().shape({
  [FILTER_NAME]: Yup.string()
    .min(3, 'Filter name should have at least 3 characters')
    .max(50, 'Filter Name should have maximum 50 characters')
    .required('Required'),
});
