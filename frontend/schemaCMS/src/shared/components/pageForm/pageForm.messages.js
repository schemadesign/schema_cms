/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  PAGE_NAME,
  PAGE_KEYWORDS,
  PAGE_DESCRIPTION,
  PAGE_DISPLAY_NAME,
  PAGE_TEMPLATE,
  PAGE_IS_PUBLIC,
  PAGE_TAGS,
  PAGE_LINK,
} from '../../../modules/page/page.constants';

export default defineMessages({
  [`${PAGE_NAME}Placeholder`]: {
    id: `shared.components.pageForm.${PAGE_NAME}Placeholder`,
    defaultMessage: 'Name',
  },
  [PAGE_NAME]: {
    id: `shared.components.pageForm.${PAGE_NAME}`,
    defaultMessage: 'Name',
  },
  [PAGE_KEYWORDS]: {
    id: `shared.components.pageForm.${PAGE_KEYWORDS}`,
    defaultMessage: 'SEO Keywords',
  },
  [PAGE_DESCRIPTION]: {
    id: `shared.components.pageForm.${PAGE_DESCRIPTION}`,
    defaultMessage: 'SEO Page Description',
  },
  [PAGE_DISPLAY_NAME]: {
    id: `shared.components.pageForm.${PAGE_DISPLAY_NAME}`,
    defaultMessage: 'URL Display Name',
  },
  [PAGE_TEMPLATE]: {
    id: `shared.components.pageForm.${PAGE_TEMPLATE}`,
    defaultMessage: 'Page Template',
  },
  [`${PAGE_TEMPLATE}Placeholder`]: {
    id: `shared.components.pageForm.${PAGE_TEMPLATE}Placeholder`,
    defaultMessage: 'Select Page Template',
  },
  [PAGE_IS_PUBLIC]: {
    id: `shared.components.pageForm.${PAGE_IS_PUBLIC}`,
    defaultMessage: 'Make it Public',
  },
  [PAGE_TAGS]: {
    id: `shared.components.pageForm.${PAGE_TAGS}`,
    defaultMessage: 'Tags',
  },
  [PAGE_LINK]: {
    id: `shared.components.pageForm.${PAGE_LINK}`,
    defaultMessage: 'Frontend page Link',
  },
  pageAvailability: {
    id: 'shared.components.pageForm.pageAvailability',
    defaultMessage: 'This Page is currently {availability}',
  },
  privateCopy: {
    id: 'shared.components.pageForm.privateCopy',
    defaultMessage: 'Private',
  },
  publicCopy: {
    id: 'shared.components.pageForm.publicCopy',
    defaultMessage: 'Public',
  },
  visitPage: {
    id: 'shared.components.pageForm.visitPage',
    defaultMessage: 'Visit Page',
  },
  blankTemplate: {
    id: 'shared.components.pageForm.blankTemplate',
    defaultMessage: '(blank)',
  },
  changeTitle: {
    id: 'shared.components.pageForm.changeTitle',
    defaultMessage: 'Changing a template will remove any blocks you added. Are you sure you want to proceed?',
  },
  cancelChange: {
    id: 'shared.components.pageForm.cancelChange',
    defaultMessage: 'Cancel',
  },
  confirmChange: {
    id: 'shared.components.pageForm.confirmChange',
    defaultMessage: 'Confirm',
  },
  addBlockButton: {
    id: 'shared.components.pageForm.addBlockButton',
    defaultMessage: 'Block',
  },
  blocks: {
    id: 'shared.components.pageForm.blocks',
    defaultMessage: 'Block',
  },
  collapseCopy: {
    id: 'shared.components.pageForm.collapseCopy',
    defaultMessage: 'Collapse Blocks',
  },
  expandCopy: {
    id: 'shared.components.pageForm.expandCopy',
    defaultMessage: 'Expand Blocks',
  },
  copyConfirmTitle: {
    id: 'shared.components.pageForm.copyConfirmTitle',
    defaultMessage: 'There are unsaved data. Do you want to copy without it?',
  },
  cancelCopy: {
    id: 'shared.components.pageForm.cancelCopy',
    defaultMessage: 'Cancel',
  },
  confirmCopy: {
    id: 'shared.components.pageForm.confirmCopy',
    defaultMessage: 'Copy',
  },
  deleteButton: {
    id: 'shared.components.pageForm.deleteButton',
    defaultMessage: 'Delete Page',
  },
});
