/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { PROJECT_STATUSES } from '../../../modules/project/project.constants';

const { IN_PROGRESS, DONE, HOLD, PUBLISHED } = PROJECT_STATUSES;

export default defineMessages({
  pageTitle: {
    id: 'project.create.pageTitle',
    defaultMessage: 'Create New Project',
  },
  pageSubTitle: {
    id: 'project.create.pageSubTitle',
    defaultMessage: 'Project Info',
  },
  projectTitleLabel: {
    id: 'project.create.projectTitleLabel',
    defaultMessage: 'Title',
  },
  projectTitlePlaceholder: {
    id: 'project.create.projectTitlePlaceholder',
    defaultMessage: 'Project title',
  },
  projectDescriptionLabel: {
    id: 'project.create.projectDescriptionLabel',
    defaultMessage: 'Description',
  },
  projectDescriptionPlaceholder: {
    id: 'project.create.projectDescriptionPlaceholder',
    defaultMessage: 'Project description',
  },
  apiNameLabel: {
    id: 'project.create.apiNameLabel',
    defaultMessage: 'API Name',
  },
  projectOwnerLabel: {
    id: 'project.create.projectOwnerLabel',
    defaultMessage: 'Owner',
  },
  projectDomainLabel: {
    id: 'project.create.projectDomainLabel',
    defaultMessage: 'Domain',
  },
  statusLabel: {
    id: 'project.create.statusLabel',
    defaultMessage: 'Status',
  },
  finish: {
    id: 'project.create.finish',
    defaultMessage: 'Finish',
  },
  cancel: {
    id: 'project.create.cancel',
    defaultMessage: 'Cancel',
  },
  [IN_PROGRESS]: {
    id: `project.create.${IN_PROGRESS}`,
    defaultMessage: 'In Progress',
  },
  [DONE]: {
    id: `project.create.${DONE}`,
    defaultMessage: 'Done',
  },
  [HOLD]: {
    id: `project.create.${HOLD}`,
    defaultMessage: 'Hold',
  },
  [PUBLISHED]: {
    id: `project.create.${PUBLISHED}`,
    defaultMessage: 'Published',
  },
  titleProjectTitleUniqueError: {
    id: 'project.create.titleProjectTitleUniqueError',
    defaultMessage: 'Project with this title already exists.',
  },
});
