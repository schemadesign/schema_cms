/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  CODE_TYPE,
  CONNECTION_TYPE,
  ELEMENT_TYPE,
  FILE_TYPE,
  IMAGE_TYPE,
  PARAMS_BLOCK,
  PLAIN_TEXT_TYPE,
  MARKDOWN_TYPE,
  INTERNAL_CONNECTION_TYPE,
  CUSTOM_ELEMENT_TYPE,
  OBSERVABLEHQ_TYPE,
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
  [MARKDOWN_TYPE]: {
    id: `shared.components.blockTemplateElement.${MARKDOWN_TYPE}`,
    defaultMessage: 'Markdown',
  },
  [PLAIN_TEXT_TYPE]: {
    id: `shared.components.blockTemplateElement.${PLAIN_TEXT_TYPE}`,
    defaultMessage: 'Plain text',
  },
  [IMAGE_TYPE]: {
    id: `shared.components.blockTemplateElement.${IMAGE_TYPE}`,
    defaultMessage: 'Image',
  },
  [FILE_TYPE]: {
    id: `shared.components.blockTemplateElement.${FILE_TYPE}`,
    defaultMessage: 'File',
  },
  [CODE_TYPE]: {
    id: `shared.components.blockTemplateElement.${CODE_TYPE}`,
    defaultMessage: 'Code',
  },
  [CONNECTION_TYPE]: {
    id: `shared.components.blockTemplateElement.${CONNECTION_TYPE}`,
    defaultMessage: 'Connection',
  },
  [INTERNAL_CONNECTION_TYPE]: {
    id: `shared.components.blockTemplateElement.${INTERNAL_CONNECTION_TYPE}`,
    defaultMessage: 'Internal Connection',
  },
  [OBSERVABLEHQ_TYPE]: {
    id: `shared.components.blockTemplateElement.${OBSERVABLEHQ_TYPE}`,
    defaultMessage: 'ObservableHQ',
  },
  [CUSTOM_ELEMENT_TYPE]: {
    id: `shared.components.blockTemplateElement.${CUSTOM_ELEMENT_TYPE}`,
    defaultMessage: 'Custom Element',
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
  elements: {
    id: 'shared.components.blockTemplateElement.elements',
    defaultMessage: 'Element',
  },
  warningFile: {
    id: 'shared.components.blockTemplateElement.warningFile',
    defaultMessage: 'Notice: Files uploaded are available publicly.',
  },
  warningImage: {
    id: 'shared.components.blockTemplateElement.warningImage',
    defaultMessage: 'Notice: Images uploaded are available publicly.',
  },
  warningMultiple: {
    id: 'shared.components.blockTemplateElement.warningMultiple',
    defaultMessage: 'Notice: images & files uploaded are available publicly.',
  },
});
