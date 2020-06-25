/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  IMAGE_TYPE,
  FILE_TYPE,
  INTERNAL_CONNECTION_TYPE,
  OBSERVABLE_CELL,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_USER,
  OBSERVABLE_PARAMS,
  CONNECTION_TYPE,
  CODE_TYPE,
  MARKDOWN_TYPE,
  PLAIN_TEXT_TYPE,
  OBSERVABLEHQ_TYPE,
  EMBED_VIDEO_ATTRIBUTES,
  EMBED_VIDEO_TYPE,
  STATE_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { FILE_ALT } from '../../../modules/page/page.constants';

export default defineMessages({
  [IMAGE_TYPE]: {
    id: `shared.components.blockElement.${IMAGE_TYPE}`,
    defaultMessage: 'Image',
  },
  [`${IMAGE_TYPE}Placeholder`]: {
    id: `shared.components.blockElement.${IMAGE_TYPE}Placeholder`,
    defaultMessage: 'Select image or Drag and Drop it here',
  },
  [`${FILE_TYPE}Placeholder`]: {
    id: `shared.components.blockElement.${FILE_TYPE}Placeholder`,
    defaultMessage: 'Select file or Drag and Drop it here',
  },
  [INTERNAL_CONNECTION_TYPE]: {
    id: `shared.components.blockElement.${INTERNAL_CONNECTION_TYPE}`,
    defaultMessage: 'Page',
  },
  [`${INTERNAL_CONNECTION_TYPE}Placeholder`]: {
    id: `shared.components.blockElement.${INTERNAL_CONNECTION_TYPE}Placeholder`,
    defaultMessage: 'Select a page',
  },
  [`${INTERNAL_CONNECTION_TYPE}NoOptions`]: {
    id: `shared.components.blockElement.${INTERNAL_CONNECTION_TYPE}NoOptions`,
    defaultMessage: 'No Internal Connections available',
  },
  [`${STATE_TYPE}Placeholder`]: {
    id: `shared.components.blockElement.${STATE_TYPE}Placeholder`,
    defaultMessage: 'Select a state',
  },
  [`${STATE_TYPE}NoOptions`]: {
    id: `shared.components.blockElement.${STATE_TYPE}NoOptions`,
    defaultMessage: 'No States available',
  },
  [`${OBSERVABLE_USER}Placeholder`]: {
    id: `shared.components.blockElement.${OBSERVABLE_USER}Placeholder`,
    defaultMessage: 'ObservableHQ User',
  },
  [`${OBSERVABLE_NOTEBOOK}Placeholder`]: {
    id: `shared.components.blockElement.${OBSERVABLE_NOTEBOOK}Placeholder`,
    defaultMessage: 'ObservableHQ Notebook',
  },
  [`${OBSERVABLE_CELL}Placeholder`]: {
    id: `shared.components.blockElement.${OBSERVABLE_CELL}Placeholder`,
    defaultMessage: 'ObservableHQ Cells',
  },
  [`${OBSERVABLE_PARAMS}Placeholder`]: {
    id: `shared.components.blockElement.${OBSERVABLE_PARAMS}Placeholder`,
    defaultMessage: 'ObservableHQ Params',
  },
  blocks: {
    id: 'shared.components.blockElement.blocks',
    defaultMessage: 'Block',
  },
  [MARKDOWN_TYPE]: {
    id: `shared.components.blockElement.${MARKDOWN_TYPE}`,
    defaultMessage: 'Markdown',
  },
  [PLAIN_TEXT_TYPE]: {
    id: `shared.components.blockElement.${PLAIN_TEXT_TYPE}`,
    defaultMessage: 'Plain text',
  },
  [STATE_TYPE]: {
    id: `shared.components.blockElement.${STATE_TYPE}`,
    defaultMessage: 'State',
  },
  [IMAGE_TYPE]: {
    id: `shared.components.blockElement.${IMAGE_TYPE}`,
    defaultMessage: 'Image',
  },
  [FILE_TYPE]: {
    id: `shared.components.blockElement.${FILE_TYPE}`,
    defaultMessage: 'File',
  },
  [CODE_TYPE]: {
    id: `shared.components.blockElement.${CODE_TYPE}`,
    defaultMessage: 'Code',
  },
  [CONNECTION_TYPE]: {
    id: `shared.components.blockElement.${CONNECTION_TYPE}`,
    defaultMessage: 'Connection',
  },
  [INTERNAL_CONNECTION_TYPE]: {
    id: `shared.components.blockElement.${INTERNAL_CONNECTION_TYPE}`,
    defaultMessage: 'Internal Connection',
  },
  [OBSERVABLEHQ_TYPE]: {
    id: `shared.components.blockElement.${OBSERVABLEHQ_TYPE}`,
    defaultMessage: 'ObservableHQ',
  },
  [EMBED_VIDEO_TYPE]: {
    id: `shared.components.blockElement.${EMBED_VIDEO_TYPE}`,
    defaultMessage: 'Embed Video',
  },
  [EMBED_VIDEO_ATTRIBUTES]: {
    id: `shared.components.blockElement.${EMBED_VIDEO_ATTRIBUTES}`,
    defaultMessage: 'Attributes',
  },
  [`${EMBED_VIDEO_ATTRIBUTES}Placeholder`]: {
    id: `shared.components.blockElement.${EMBED_VIDEO_ATTRIBUTES}Placeholder`,
    defaultMessage: 'e.g. width="100%" height="1000px"',
  },
  set: {
    id: 'shared.components.blockElement.set',
    defaultMessage: 'Set',
  },
  fileSizeError: {
    id: 'shared.components.blockElement.fileSizeError',
    defaultMessage: '{type} should have maximum 50MB',
  },
  elementNamePlaceholder: {
    id: 'shared.components.blockElement.elementNamePlaceholder',
    defaultMessage: 'Element Name',
  },
  [FILE_ALT]: {
    id: `shared.components.blockElement.${FILE_ALT}`,
    defaultMessage: 'Alt',
  },
  collapseCopy: {
    id: 'shared.components.blockElement.collapseCopy',
    defaultMessage: 'Collapse Set',
  },
  expandCopy: {
    id: 'shared.components.blockElement.expandCopy',
    defaultMessage: 'Expand Set',
  },
});
