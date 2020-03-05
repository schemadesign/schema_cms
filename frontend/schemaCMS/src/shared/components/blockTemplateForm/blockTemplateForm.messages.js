/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { BLOCK_TEMPLATES_NAME } from '../../../modules/blockTemplates/blockTemplates.constants';

export default defineMessages({
  [`${BLOCK_TEMPLATES_NAME}Placeholder`]: {
    id: `shared.components.blockTemplateForm.${BLOCK_TEMPLATES_NAME}Placeholder`,
    defaultMessage: 'Name',
  },
  elements: {
    id: 'shared.components.blockTemplateForm.elements',
    defaultMessage: 'Element',
  },
});
