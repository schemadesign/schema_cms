/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { BLOCK_TYPE } from '../../../modules/pageTemplates/pageTemplates.constants';

export default defineMessages({
  typePlaceholder: {
    id: 'shared.components.pageTemplateBlock.typePlaceholder',
    defaultMessage: 'Select Element Type',
  },
  namePlaceholder: {
    id: 'shared.components.pageTemplateBlock.namePlaceholder',
    defaultMessage: 'Name',
  },
  [BLOCK_TYPE]: {
    id: `shared.components.pageTemplateBlock.${BLOCK_TYPE}`,
    defaultMessage: 'Block Type',
  },
  blockPlaceholder: {
    id: 'shared.components.pageTemplateBlock.typePlaceholder',
    defaultMessage: 'Select Block Type',
  },
  noBlocksPlaceholder: {
    id: 'shared.components.pageTemplateBlock.noBlocksPlaceholder',
    defaultMessage: 'No blocks available',
  },
});
