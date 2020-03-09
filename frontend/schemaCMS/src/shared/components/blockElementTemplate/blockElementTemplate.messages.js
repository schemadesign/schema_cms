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
  STACK_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';

export default defineMessages({
  typePlaceholder: {
    id: 'shared.components.blockElementTemplate.typePlaceholder',
    defaultMessage: 'Select Element Type',
  },
  namePlaceholder: {
    id: 'shared.components.blockElementTemplate.namePlaceholder',
    defaultMessage: 'Name',
  },
  [ELEMENT_TYPE]: {
    id: `shared.components.blockElementTemplate.${ELEMENT_TYPE}`,
    defaultMessage: 'Element Type',
  },
  [RICH_TEXT_TYPE]: {
    id: `shared.components.blockElementTemplate.${RICH_TEXT_TYPE}`,
    defaultMessage: 'Rich text',
  },
  [PLAIN_TEXT_TYPE]: {
    id: `shared.components.blockElementTemplate.${PLAIN_TEXT_TYPE}`,
    defaultMessage: 'Plain text',
  },
  [IMAGE_TYPE]: {
    id: `shared.components.blockElementTemplate.${IMAGE_TYPE}`,
    defaultMessage: 'Image',
  },
  [CODE_TYPE]: {
    id: `shared.components.blockElementTemplate.${CODE_TYPE}`,
    defaultMessage: 'Code',
  },
  [CONNECTION_TYPE]: {
    id: `shared.components.blockElementTemplate.${CONNECTION_TYPE}`,
    defaultMessage: 'Connection',
  },
  [STACK_TYPE]: {
    id: `shared.components.blockElementTemplate.${STACK_TYPE}`,
    defaultMessage: 'Block Stack',
  },
  [PARAMS_BLOCK]: {
    id: `shared.components.blockElementTemplate.${PARAMS_BLOCK}`,
    defaultMessage: 'Block',
  },
  blockPlaceholder: {
    id: 'shared.components.blockElementTemplate.typePlaceholder',
    defaultMessage: 'Select Block Type',
  },
  noBlocksPlaceholder: {
    id: 'shared.components.blockElementTemplate.noBlocksPlaceholder',
    defaultMessage: 'No blocks available',
  },
});
