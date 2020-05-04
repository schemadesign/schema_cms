/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  IMAGE_TYPE,
  INTERNAL_CONNECTION_TYPE,
  OBSERVABLE_CELL,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_USER,
  OBSERVABLE_PARAMS,
} from '../../../modules/blockTemplates/blockTemplates.constants';

export default defineMessages({
  [IMAGE_TYPE]: {
    id: `shared.components.blockElement.${IMAGE_TYPE}`,
    defaultMessage: 'Image',
  },
  [`${IMAGE_TYPE}Placeholder`]: {
    id: `shared.components.blockElement.${IMAGE_TYPE}Placeholder`,
    defaultMessage: 'Select image or Drag and Drop it here',
  },
  [INTERNAL_CONNECTION_TYPE]: {
    id: `shared.components.blockElement.${INTERNAL_CONNECTION_TYPE}`,
    defaultMessage: 'Page',
  },
  [`${INTERNAL_CONNECTION_TYPE}Placeholder`]: {
    id: `shared.components.blockElement.${INTERNAL_CONNECTION_TYPE}Placeholder`,
    defaultMessage: 'Select a page',
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
    defaultMessage: 'ObservableHQ Cell',
  },
  [`${OBSERVABLE_PARAMS}Placeholder`]: {
    id: `shared.components.blockElement.${OBSERVABLE_PARAMS}Placeholder`,
    defaultMessage: 'ObservableHQ Params',
  },
  blocks: {
    id: 'shared.components.blockElement.blocks',
    defaultMessage: 'Block',
  },
});
