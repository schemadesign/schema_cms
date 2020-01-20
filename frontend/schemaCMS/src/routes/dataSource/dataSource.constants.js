import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './dataSource.messages';
import { LINK_ITEM } from '../../shared/components/menu/mobileMenu/mobileMenu.constants';
import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const NONE = 'none';
export const PROJECTS_ID = 'projectsNavBtn';
export const PROJECT_DETAILS_ID = 'projectDetailsNavBtn';
export const PROJECT_DATASOURCE_ID = 'dataSourceNavBtn';
export const PROJECT_FOLDER_ID = 'folderNavBtn';
export const PROJECT_USERS_ID = 'usersNavBtn';
export const USERS_PAGE_ID = 'usersPageNavBtn';

export const getDataSourceMenuOptions = projectId => [
  {
    label: <FormattedMessage {...messages.projectsListPage} />,
    to: '/project/',
    id: PROJECTS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
  {
    label: <FormattedMessage {...messages.projectDetails} />,
    to: `/project/${projectId}`,
    id: PROJECT_DETAILS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
  {
    label: <FormattedMessage {...messages.projectDataSources} />,
    to: `/project/${projectId}/datasource`,
    id: PROJECT_DATASOURCE_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
  {
    label: <FormattedMessage {...messages.usersPage} />,
    to: `/project/${projectId}/user`,
    id: PROJECT_USERS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    label: <FormattedMessage {...messages.projectPages} />,
    to: `/project/${projectId}/folder`,
    id: PROJECT_FOLDER_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
];
