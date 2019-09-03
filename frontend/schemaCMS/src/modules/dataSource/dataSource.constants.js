import * as Yup from 'yup';

export const UPDATE_DATA_SOURCE_FORM = 'update_data_source_form';
export const DATA_SOURCE_NAME = 'name';
export const STATUS_DRAFT = 'draft';

export const INITIAL_VALUES = {
  [DATA_SOURCE_NAME]: 'My New Dataset',
};

export const DATA_SOURCE_SCHEMA = Yup.object().shape({
  [DATA_SOURCE_NAME]: Yup.string()
    .min(3, 'Project Name should have at least 3 characters')
    .max(50, 'Project Name should have maximum 50 characters')
    .required('Required'),
});
