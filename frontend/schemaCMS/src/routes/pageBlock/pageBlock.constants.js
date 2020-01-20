import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './pageBlock.messages';
import { LINK_ITEM } from '../../shared/components/menu/mobileMenu/mobileMenu.constants';
import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const NONE = 'none';
export const PROJECTS_ID = 'projectsNavBtn';
export const USERS_PAGE_ID = 'usersNavBtn';

export const PAGE_MENU_OPTIONS = [
  {
    label: <FormattedMessage {...messages.projectsListPage} />,
    to: '/project/',
    id: PROJECTS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
  {
    label: <FormattedMessage {...messages.usersPage} />,
    to: '/user/',
    id: USERS_PAGE_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN],
  },
];
