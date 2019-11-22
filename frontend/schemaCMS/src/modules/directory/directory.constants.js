import * as Yup from 'yup';

export const DIRECTORY_FORM = 'directory_form';
export const DIRECTORY_NAME = 'name';

export const INITIAL_VALUES = {
  [DIRECTORY_NAME]: '',
};

export const DIRECTORY_SCHEMA = Yup.object().shape({
  [DIRECTORY_NAME]: Yup.string()
    .min(2, 'Directory Name should have at least 2 characters')
    .max(50, 'Directory Name should have maximum 50 characters')
    .required('Required'),
});
