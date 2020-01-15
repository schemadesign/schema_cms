import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './view/view.messages';
import { LINK_ITEM } from '../../shared/components/menu/mobileMenu/mobileMenu.constants';

export const NONE = 'none';
export const PROJECTS_ID = 'projectsNavBtn';
export const PROJECT_DETAILS_ID = 'projectDetailsNavBtn';
export const PROJECT_DATASOURCE_ID = 'dataSourceNavBtn';
export const PROJECT_FOLDER_ID = 'folderNavBtn';
export const PROJECT_USERS_ID = 'usersNavBtn';

const setActiveMenu = activeId => item => {
  if (activeId === item.id) {
    return { ...item, active: true };
  }

  return item;
};

export const getMenuProjects = (projectId, activeId) => {
  const menuItems = [
    {
      label: <FormattedMessage {...messages.projectsListPage} />,
      to: '/project/',
      id: PROJECTS_ID,
      type: LINK_ITEM,
    },
    {
      label: <FormattedMessage {...messages.projectDetails} />,
      to: `/project/${projectId}`,
      id: PROJECT_DETAILS_ID,
      type: LINK_ITEM,
    },
    {
      label: <FormattedMessage {...messages.projectDataSources} />,
      to: `/project/${projectId}/datasource`,
      id: PROJECT_DATASOURCE_ID,
      type: LINK_ITEM,
    },
    {
      label: <FormattedMessage {...messages.usersPage} />,
      to: `/project/${projectId}/user`,
      id: PROJECT_USERS_ID,
      type: LINK_ITEM,
    },
    {
      label: <FormattedMessage {...messages.projectPages} />,
      to: `/project/${projectId}/folder`,
      id: PROJECT_FOLDER_ID,
      type: LINK_ITEM,
    },
  ];

  return menuItems.map(setActiveMenu(activeId));
};
