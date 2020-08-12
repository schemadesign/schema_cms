import { generateRandomString } from '../../helpers/utils';

export const DJANGO_FIRST_NAME = 'Invited From Django';
export const DJANGO_LAST_NAME = `${generateRandomString(5)}`;
export const USER_STATUS = {
  active: 'True',
  inactive: 'False',
};
export const DJANGO_SUCCESSFUL_INVITATION_MSG = `The user "${DJANGO_FIRST_NAME} ${DJANGO_LAST_NAME}" was added successfully. You may edit it again below.`;
export const DJANGO_ADMIN_ROLE = 'adminRole';
export const DJANGO_EDITOR_ROLE = 'editorRole';
