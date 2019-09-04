import * as Yup from 'yup';

export const CREATE_PROJECT_FORM = 'create_project_form';
export const PROJECT_TITLE = 'title';
export const PROJECT_DESCRIPTION = 'description';

export const INITIAL_VALUES = {
  [PROJECT_TITLE]: '',
  [PROJECT_DESCRIPTION]: '',
};

export const PROJECT_SCHEMA = Yup.object().shape({
  [PROJECT_TITLE]: Yup.string()
    .min(3, 'Project Name should have at least 3 characters')
    .max(50, 'Project Name should have maximum 50 characters')
    .required('Required'),
  [PROJECT_DESCRIPTION]: Yup.string()
    .max(150, 'Project Description should have maximum 150 characters')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .notRequired(),
});
