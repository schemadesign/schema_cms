/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { BLOCK_TYPE } from '../../../modules/page/page.constants';

export default defineMessages({
  title: {
    id: 'page.addBlock.title',
    defaultMessage: 'Block',
  },
  subtitle: {
    id: 'page.addBlock.subtitle',
    defaultMessage: 'Add',
  },
  confirmLeavingPage: {
    id: 'page.addBlock.confirmLeavingPage',
    defaultMessage: 'Confirm leaving page',
  },
  cancelLeavePage: {
    id: 'page.addBlock.cancelLeavePage',
    defaultMessage: 'Cancel',
  },
  leavingPageTitle: {
    id: 'page.addBlock.leavingPageTitle',
    defaultMessage: 'You have unsaved changes. Are you sure you want to leave?',
  },
  confirm: {
    id: 'page.addBlock.confirm',
    defaultMessage: 'Confirm',
  },
  [BLOCK_TYPE]: {
    id: `page.addBlock.${BLOCK_TYPE}`,
    defaultMessage: 'Block Type',
  },
  [`${BLOCK_TYPE}Placeholder`]: {
    id: `page.addBlock.${BLOCK_TYPE}Placeholder`,
    defaultMessage: 'Please select a type',
  },
  back: {
    id: 'page.addBlock.back',
    defaultMessage: 'Back',
  },
  add: {
    id: 'page.addBlock.add',
    defaultMessage: 'Add',
  },
  elements: {
    id: 'page.addBlock.elements',
    defaultMessage: 'Element',
  },
  blank: {
    id: 'page.addBlock.blank',
    defaultMessage: '(blank)',
  },
});
