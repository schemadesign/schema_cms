/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { PROJECT_STATUSES } from '../../../modules/project/project.constants';

const { IN_PROGRESS, DONE, HOLD, PUBLISHED } = PROJECT_STATUSES;

export default defineMessages({
  pageTitle: {
    id: 'project.list.pageTitle',
    defaultMessage: 'Projects Overview',
  },
  title: {
    id: 'project.list.title',
    defaultMessage: 'Projects',
  },
  overview: {
    id: 'project.list.overview',
    defaultMessage: 'Overview',
  },
  noProjects: {
    id: 'project.list.noProjects',
    defaultMessage: 'No Projects',
  },
  logOut: {
    id: 'project.list.logOut',
    defaultMessage: 'Log Out',
  },
  users: {
    id: 'project.list.users',
    defaultMessage: 'Users',
  },
  [IN_PROGRESS]: {
    id: `project.list.${IN_PROGRESS}`,
    defaultMessage: 'In Progress',
  },
  [DONE]: {
    id: `project.list.${DONE}`,
    defaultMessage: 'Done',
  },
  [HOLD]: {
    id: `project.list.${HOLD}`,
    defaultMessage: 'Hold',
  },
  [PUBLISHED]: {
    id: `project.list.${PUBLISHED}`,
    defaultMessage: 'Published',
  },
});
