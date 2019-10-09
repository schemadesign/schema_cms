import * as Yup from 'yup';

export const USER_CREATE_CMS_FORM = 'user_create_cms_form';
export const USER_CREATE_PROJECT_FORM = 'user_create_project_form';

export const USER_EMAIL = 'email';
export const USER_PERMISSION = 'role';

export const USER_CREATE_CMS_SCHEME = Yup.object().shape({
  [USER_PERMISSION]: Yup.string()
    .ensure()
    .required('Required'),
  [USER_EMAIL]: Yup.string()
    .email('Invalid email')
    .notRequired(),
});
