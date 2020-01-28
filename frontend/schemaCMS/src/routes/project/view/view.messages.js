/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { PROJECT_STATUSES } from '../../../modules/project/project.constants';

const { IN_PROGRESS, DONE, HOLD } = PROJECT_STATUSES;

export default defineMessages({
  pageTitle: {
    id: 'project.view.pageTitle',
    defaultMessage: 'Project',
  },
  subTitle: {
    id: 'project.view.subTitle',
    defaultMessage: 'Project',
  },
  title: {
    id: 'project.view.title',
    defaultMessage: 'Project',
  },
  dataSources: {
    id: 'project.view.dataSources',
    defaultMessage: 'Data Sources',
  },
  charts: {
    id: 'project.view.charts',
    defaultMessage: 'Charts',
  },
  pages: {
    id: 'project.view.pages',
    defaultMessage: 'Pages',
  },
  users: {
    id: 'project.view.users',
    defaultMessage: 'Users',
  },
  lastUpdate: {
    id: 'project.view.lastUpdate',
    defaultMessage: 'Last Update',
  },
  status: {
    id: 'project.view.status',
    defaultMessage: 'Status',
  },
  owner: {
    id: 'project.view.owner',
    defaultMessage: 'Owner',
  },
  titleField: {
    id: 'project.view.titleField',
    defaultMessage: 'Title',
  },
  description: {
    id: 'project.view.description',
    defaultMessage: 'Description',
  },
  api: {
    id: 'project.view.api',
    defaultMessage: 'API',
  },
  noProject: {
    id: 'project.view.noProject',
    defaultMessage: "Project doesn't exist.",
  },
  editProjectSettings: {
    id: 'project.view.editProjectSettings',
    defaultMessage: 'Edit Project Settings',
  },
  deleteProject: {
    id: 'project.view.deleteProject',
    defaultMessage: 'Delete Project',
  },
  logOut: {
    id: 'project.view.logOut',
    defaultMessage: 'Log Out',
  },
  [IN_PROGRESS]: {
    id: `project.view.${IN_PROGRESS}`,
    defaultMessage: 'In Progress',
  },
  [DONE]: {
    id: `project.view.${DONE}`,
    defaultMessage: 'Done',
  },
  [HOLD]: {
    id: `project.view.${HOLD}`,
    defaultMessage: 'Hold',
  },
  removeTitle: {
    id: 'project.view.removeTitle',
    defaultMessage: 'Are you sure you want to delete the project?',
  },
  cancelRemoval: {
    id: 'project.view.cancelRemoval',
    defaultMessage: 'Cancel',
  },
  confirmRemoval: {
    id: 'project.view.confirmRemoval',
    defaultMessage: 'Confirm',
  },
  projectDetails: {
    id: 'project.view.projectDetails',
    defaultMessage: 'Project details',
  },
  projectDataSources: {
    id: 'project.view.projectDataSources',
    defaultMessage: 'Data Sources',
  },
  projectPages: {
    id: 'project.view.projectPages',
    defaultMessage: 'Pages',
  },
  projectsListPage: {
    id: 'project.view.projectsListPage',
    defaultMessage: 'Projects',
  },
  usersPage: {
    id: 'project.view.usersPage',
    defaultMessage: 'Users',
  },
  projectUsersPage: {
    id: 'project.view.projectUsersPage',
    defaultMessage: 'Project Users',
  },
});
