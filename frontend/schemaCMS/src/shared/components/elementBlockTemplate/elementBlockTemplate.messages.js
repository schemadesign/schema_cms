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
    id: 'shared.components.elementBlockTemplate.typePlaceholder',
    defaultMessage: 'Select Element Type',
  },
  namePlaceholder: {
    id: 'shared.components.elementBlockTemplate.namePlaceholder',
    defaultMessage: 'Name',
  },
  [ELEMENT_TYPE]: {
    id: `shared.components.elementBlockTemplate.${ELEMENT_TYPE}`,
    defaultMessage: 'Element Type',
  },
  [RICH_TEXT_TYPE]: {
    id: `shared.components.elementBlockTemplate.${RICH_TEXT_TYPE}`,
    defaultMessage: 'Rich text',
  },
  [PLAIN_TEXT_TYPE]: {
    id: `shared.components.elementBlockTemplate.${PLAIN_TEXT_TYPE}`,
    defaultMessage: 'Plain text',
  },
  [IMAGE_TYPE]: {
    id: `shared.components.elementBlockTemplate.${IMAGE_TYPE}`,
    defaultMessage: 'Image',
  },
  [CODE_TYPE]: {
    id: `shared.components.elementBlockTemplate.${CODE_TYPE}`,
    defaultMessage: 'Code',
  },
  [CONNECTION_TYPE]: {
    id: `shared.components.elementBlockTemplate.${CONNECTION_TYPE}`,
    defaultMessage: 'Connection',
  },
  [STACK_TYPE]: {
    id: `shared.components.elementBlockTemplate.${STACK_TYPE}`,
    defaultMessage: 'Block Stack',
  },
  [PARAMS_BLOCK]: {
    id: `shared.components.elementBlockTemplate.${PARAMS_BLOCK}`,
    defaultMessage: 'Block',
  },
  blockPlaceholder: {
    id: 'shared.components.elementBlockTemplate.typePlaceholder',
    defaultMessage: 'Select Block Type',
  },
  noBlocksPlaceholder: {
    id: 'shared.components.elementBlockTemplate.noBlocksPlaceholder',
    defaultMessage: 'No blocks available',
  },
});
