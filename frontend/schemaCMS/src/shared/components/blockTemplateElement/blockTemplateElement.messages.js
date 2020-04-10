/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  CODE_TYPE,
  CONNECTION_TYPE,
  ELEMENT_TYPE,
  IMAGE_TYPE,
  PARAMS_BLOCK,
  PLAIN_TEXT_TYPE,
  RICH_TEXT_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';

export default defineMessages({
  typePlaceholder: {
    id: 'shared.components.blockTemplateElement.typePlaceholder',
    defaultMessage: 'Select Element Type',
  },
  namePlaceholder: {
    id: 'shared.components.blockTemplateElement.namePlaceholder',
    defaultMessage: 'Name',
  },
  [ELEMENT_TYPE]: {
    id: `shared.components.blockTemplateElement.${ELEMENT_TYPE}`,
    defaultMessage: 'Element Type',
  },
  [RICH_TEXT_TYPE]: {
    id: `shared.components.blockTemplateElement.${RICH_TEXT_TYPE}`,
    defaultMessage: 'Rich text',
  },
  [PLAIN_TEXT_TYPE]: {
    id: `shared.components.blockTemplateElement.${PLAIN_TEXT_TYPE}`,
    defaultMessage: 'Plain text',
  },
  [IMAGE_TYPE]: {
    id: `shared.components.blockTemplateElement.${IMAGE_TYPE}`,
    defaultMessage: 'Image',
  },
  [CODE_TYPE]: {
    id: `shared.components.blockTemplateElement.${CODE_TYPE}`,
    defaultMessage: 'Code',
  },
  [CONNECTION_TYPE]: {
    id: `shared.components.blockTemplateElement.${CONNECTION_TYPE}`,
    defaultMessage: 'Connection',
  },
  [PARAMS_BLOCK]: {
    id: `shared.components.blockTemplateElement.${PARAMS_BLOCK}`,
    defaultMessage: 'Block',
  },
  blockPlaceholder: {
    id: 'shared.components.blockTemplateElement.typePlaceholder',
    defaultMessage: 'Select Block Type',
  },
  noBlocksPlaceholder: {
    id: 'shared.components.blockTemplateElement.noBlocksPlaceholder',
    defaultMessage: 'No blocks available',
  },
});
