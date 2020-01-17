import { FormattedMessage } from 'react-intl';
import React from 'react';

import messages from './user.messages';
import { LINK_ITEM } from '../../shared/components/menu/mobileMenu/mobileMenu.constants';
import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const PROJECTS_ID = 'projectsNavBtn';
export const USER_ID = 'userNavBtn';

export const USER_MENU_OPTIONS = [
  {
    label: <FormattedMessage {...messages.projectsListPage} />,
    to: '/project/',
    id: PROJECTS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    label: <FormattedMessage {...messages.userPage} />,
    to: '/user/',
    id: USER_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN],
  },
];
