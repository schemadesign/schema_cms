/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { SECTIONS_NAME } from '../../../modules/sections/sections.constants';

export default defineMessages({
  title: {
    id: 'project.createSection.title',
    defaultMessage: 'Section',
  },
  subtitle: {
    id: 'project.createSection.subtitle',
    defaultMessage: 'Create',
  },
  cancel: {
    id: 'project.createSection.cancel',
    defaultMessage: 'Cancel',
  },
  create: {
    id: 'project.createSection.create',
    defaultMessage: 'Create',
  },
  [SECTIONS_NAME]: {
    id: `project.createSection.${SECTIONS_NAME}`,
    defaultMessage: 'Name',
  },
  nameSectionNameUniqueError: {
    id: 'project.createSection.nameSectionNameUniqueError',
    defaultMessage: 'A section with this name already exists in project',
  },
});
