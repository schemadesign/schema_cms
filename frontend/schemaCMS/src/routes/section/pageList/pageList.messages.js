/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { SECTIONS_NAME, SECTIONS_PUBLISH, SECTIONS_RSS } from '../../../modules/sections/sections.constants';

export default defineMessages({
  title: {
    id: 'section.pageList.title',
    defaultMessage: 'Section',
  },
  subtitle: {
    id: 'section.pageList.subtitle',
    defaultMessage: 'Edit',
  },
  page: {
    id: 'section.pageList.page',
    defaultMessage: 'page',
  },
  addPageButton: {
    id: 'section.pageList.addPageButton',
    defaultMessage: 'Page',
  },
  [SECTIONS_NAME]: {
    id: `section.pageList.${SECTIONS_NAME}`,
    defaultMessage: 'Name',
  },
  [`${SECTIONS_NAME}Placeholder`]: {
    id: `section.pageList.${SECTIONS_NAME}Placeholder`,
    defaultMessage: 'Name',
  },
  save: {
    id: 'section.pageList.save',
    defaultMessage: 'Save',
  },
  cancelRemoval: {
    id: 'section.pageList.cancelRemoval',
    defaultMessage: 'Cancel',
  },
  confirmRemoval: {
    id: 'section.pageList.confirmRemoval',
    defaultMessage: 'Confirm',
  },
  removeTitle: {
    id: 'section.pageList.removeTitle',
    defaultMessage: 'Are you sure you want to remove this section?',
  },
  draft: {
    id: 'section.pageList.draft',
    defaultMessage: 'Draft',
  },
  [SECTIONS_PUBLISH]: {
    id: `section.pageList.${SECTIONS_PUBLISH}`,
    defaultMessage: 'Make it Public',
  },
  [SECTIONS_RSS]: {
    id: `section.pageList.${SECTIONS_RSS}`,
    defaultMessage: 'Make it available for RSS',
  },
  sectionAvailability: {
    id: 'section.pageList.sectionAvailability',
    defaultMessage: 'This Section is currently {availability}',
  },
  sectionRssEnabled: {
    id: 'section.pageList.sectionRssEnabled',
    defaultMessage: 'This Section is currently {availability} for RSS feed',
  },
  privateCopy: {
    id: 'section.pageList.privateCopy',
    defaultMessage: 'Private',
  },
  publicCopy: {
    id: 'section.pageList.publicCopy',
    defaultMessage: 'Public',
  },
  enabledRss: {
    id: 'section.pageList.enabledRss',
    defaultMessage: 'enabled',
  },
  disabledRss: {
    id: 'section.pageList.disabledRss',
    defaultMessage: 'disabled',
  },
  visitPage: {
    id: 'section.pageList.visitPage',
    defaultMessage: 'Visit Page',
  },
  blankTemplate: {
    id: 'section.pageList.visitPage',
    defaultMessage: '(blank)',
  },
  nameSectionNameUniqueError: {
    id: 'section.pageList.nameSectionNameUniqueError',
    defaultMessage: 'A section with this name already exists in project',
  },
  deleteButton: {
    id: 'section.pageList.deleteButton',
    defaultMessage: 'Delete Section',
  },
  dotsMenuSetAsHomePage: {
    id: 'section.pageList.dotsMenu.setAsHomePage',
    defaultMessage: 'Set as Home Page',
  },
  dotsMenuUnsetAsHomePage: {
    id: 'section.pageList.dotsMenu.unsetAsHomePage',
    defaultMessage: 'Unset as Home Page',
  },
  dotsMenuEdit: {
    id: 'section.pageList.dotsMenu.Edit',
    defaultMessage: 'Edit',
  },
  dotsMenuDuplicate: {
    id: 'section.pageList.dotsMenu.Duplicate',
    defaultMessage: 'Duplicate',
  },
  dotsMenuDelete: {
    id: 'section.pageList.dotsMenu.Delete',
    defaultMessage: 'Delete',
  },
});
