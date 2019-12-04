import * as Yup from 'yup';

export const FOLDER_FORM = 'folder_form';
export const FOLDER_NAME = 'name';

export const INITIAL_VALUES = {
  [FOLDER_NAME]: '',
};

export const FOLDER_SCHEMA = Yup.object().shape({
  [FOLDER_NAME]: Yup.string()
    .trim()
    .min(2, 'Folder Name should have at least 2 characters')
    .max(50, 'Folder Name should have maximum 50 characters')
    .required('Required'),
});
