/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  BLOCK_TEMPLATES_IS_AVAILABLE,
  BLOCK_TEMPLATES_NAME,
} from '../../../modules/blockTemplates/blockTemplates.constants';

export default defineMessages({
  [`${BLOCK_TEMPLATES_NAME}Placeholder`]: {
    id: `shared.components.blockTemplateForm.${BLOCK_TEMPLATES_NAME}Placeholder`,
    defaultMessage: 'Name',
  },
  elements: {
    id: 'shared.components.blockTemplateForm.elements',
    defaultMessage: 'Element',
  },
  [BLOCK_TEMPLATES_NAME]: {
    id: `shared.components.blockTemplateForm.${BLOCK_TEMPLATES_NAME}`,
    defaultMessage: 'Name',
  },
  [BLOCK_TEMPLATES_IS_AVAILABLE]: {
    id: `shared.components.blockTemplateForm.${BLOCK_TEMPLATES_IS_AVAILABLE}`,
    defaultMessage: 'Make it Available',
  },
  availableForEditors: {
    id: 'shared.components.blockTemplateForm.availableForEditors',
    defaultMessage: 'This Template is currently {negative}available for Editors',
  },
  collapseCopy: {
    id: 'shared.components.blockTemplateForm.collapseCopy',
    defaultMessage: 'Collapse Elements',
  },
  expandCopy: {
    id: 'shared.components.blockTemplateForm.expandCopy',
    defaultMessage: 'Expand Elements',
  },
  copyConfirmTitle: {
    id: 'shared.components.blockTemplateForm.copyConfirmTitle',
    defaultMessage: 'There are unsaved data. Do you want to copy without it?',
  },
  cancelCopy: {
    id: 'shared.components.blockTemplateForm.cancelCopy',
    defaultMessage: 'Cancel',
  },
  confirmCopy: {
    id: 'shared.components.blockTemplateForm.confirmCopy',
    defaultMessage: 'Copy',
  },
});
