/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  BLOCK_TEMPLATES_ALLOW_ADD,
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
  [BLOCK_TEMPLATES_ALLOW_ADD]: {
    id: `shared.components.blockTemplateForm.${BLOCK_TEMPLATES_ALLOW_ADD}`,
    defaultMessage: 'Allow new Elements to be added to this Block Template',
  },
  availableForEditors: {
    id: 'shared.components.blockTemplateForm.availableForEditors',
    defaultMessage: 'This Template is currently unavailable for Editors',
  },
});
