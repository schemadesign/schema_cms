/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { IMAGE_TYPE, INTERNAL_CONNECTION_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';

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
  blocks: {
    id: 'shared.components.blockElement.blocks',
    defaultMessage: 'Block',
  },
});
