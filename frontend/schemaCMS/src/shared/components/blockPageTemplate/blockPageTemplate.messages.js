/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { BLOCK_TYPE } from '../../../modules/pageTemplates/pageTemplates.constants';

export default defineMessages({
  typePlaceholder: {
    id: 'shared.components.blockPageTemplate.typePlaceholder',
    defaultMessage: 'Select Element Type',
  },
  namePlaceholder: {
    id: 'shared.components.blockPageTemplate.namePlaceholder',
    defaultMessage: 'Name',
  },
  [BLOCK_TYPE]: {
    id: `shared.components.blockPageTemplate.${BLOCK_TYPE}`,
    defaultMessage: 'Block Type',
  },
  blockPlaceholder: {
    id: 'shared.components.blockPageTemplate.typePlaceholder',
    defaultMessage: 'Select Block Type',
  },
  noBlocksPlaceholder: {
    id: 'shared.components.blockPageTemplate.noBlocksPlaceholder',
    defaultMessage: 'No blocks available',
  },
});
