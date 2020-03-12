/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  PAGE_TEMPLATES_NAME,
  PAGE_TEMPLATES_IS_AVAILABLE,
  PAGE_TEMPLATES_ALLOW_ADD,
} from '../../../modules/pageTemplates/pageTemplates.constants';

export default defineMessages({
  blocks: {
    id: 'shared.components.pageTemplateForm.blocks',
    defaultMessage: 'Block',
  },
  [`${PAGE_TEMPLATES_NAME}Placeholder`]: {
    id: `shared.components.pageTemplateForm.${PAGE_TEMPLATES_NAME}Placeholder`,
    defaultMessage: 'Name',
  },
  [PAGE_TEMPLATES_NAME]: {
    id: `shared.components.pageTemplateForm.${PAGE_TEMPLATES_NAME}`,
    defaultMessage: 'Name',
  },
  [PAGE_TEMPLATES_IS_AVAILABLE]: {
    id: `shared.components.pageTemplateForm.${PAGE_TEMPLATES_IS_AVAILABLE}`,
    defaultMessage: 'Make it Available',
  },
  [PAGE_TEMPLATES_ALLOW_ADD]: {
    id: `shared.components.pageTemplateForm.${PAGE_TEMPLATES_ALLOW_ADD}`,
    defaultMessage: 'Allow new Blocks to be added to this Page Template',
  },
  availableForEditors: {
    id: 'shared.components.pageTemplateForm.availableForEditors',
    defaultMessage: 'This Template is currently {negative}available for Editors',
  },
});
