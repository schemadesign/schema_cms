import * as Yup from 'yup';
import { EMAIL } from '../userProfile/userProfile.constants';

export const USER_CREATE_CMS_FORM = 'user_create_cms_form';
export const USER_CREATE_PROJECT_FORM = 'user_create_project_form';

const EDITOR = 'editor';
const ADMIN = 'admin';

export const USER_ROLE = 'role';

export const NEW_USER_ROLES_OPTIONS = [{ value: ADMIN, label: 'Admin' }, { value: EDITOR, label: 'Editor' }];

export const USER_CREATE_CMS_SCHEME = Yup.object().shape({
  [USER_ROLE]: Yup.string()
    .ensure()
    .required('Required'),
  [EMAIL]: Yup.string()
    .email('Invalid email')
    .notRequired(),
});
