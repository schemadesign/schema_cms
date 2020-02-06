import * as Yup from 'yup';

export const FILTER_NAME = 'name';
export const FILTER_TYPE = 'filterType';
export const FILTER_FIELD = 'field';
export const FILTER_FIELD_NAME = 'fieldName';
export const FILTER_FIELD_TYPE = 'fieldType';
export const FILTER_UNIQUE_ITEMS = 'unique';

export const FILTER_TYPE_SELECT = 'select';
export const FILTER_TYPE_CHECKBOX = 'checkbox';
export const FILTER_TYPE_RANGE = 'range';
export const FILTER_TYPE_BOOL = 'bool';
export const FILTER_TYPE_VALUE = 'value';

export const INITIAL_VALUES = {
  [FILTER_NAME]: '',
  [FILTER_TYPE]: '',
  [FILTER_FIELD]: '',
  [FILTER_FIELD_TYPE]: '',
  [FILTER_UNIQUE_ITEMS]: '',
};

export const FILTERS_SCHEMA = Yup.object().shape({
  [FILTER_NAME]: Yup.string()
    .trim()
    .min(3, 'Filter name should have at least 3 characters')
    .max(25, 'Filter name should have maximum 25 characters')
    .required('Required'),
});
