import { FormattedMessage } from 'react-intl';
import React from 'react';

import messages from './settings.messages';
import { LINK_ITEM } from '../../shared/components/menu/mobileMenu/mobileMenu.constants';
import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const SETTINGS_PROJECTS_ID = 'projectsNavBtn';
export const SETTINGS_USERS_ID = 'usersNavBtn';

export const SETTINGS_MENU_OPTIONS = [
  {
    label: <FormattedMessage {...messages.projectsListPage} />,
    to: '/project/',
    id: SETTINGS_PROJECTS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
  {
    label: <FormattedMessage {...messages.usersPage} />,
    to: '/user/',
    id: SETTINGS_USERS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN],
  },
];
