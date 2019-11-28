/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

import { ROLES } from '../../../modules/userProfile/userProfile.constants';

const { ADMIN, EDITOR } = ROLES;

export default defineMessages({
  [ADMIN]: {
    id: `shared.components.userList.${ADMIN}`,
    defaultMessage: 'Admin',
  },
  [EDITOR]: {
    id: `shared.components.userList.${EDITOR}`,
    defaultMessage: 'Editor',
  },
});
