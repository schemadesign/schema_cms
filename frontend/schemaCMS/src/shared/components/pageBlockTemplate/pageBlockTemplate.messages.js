/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { BLOCK_TYPE } from '../../../modules/pageTemplates/pageTemplates.constants';

export default defineMessages({
  typePlaceholder: {
    id: 'shared.components.pageBlockTemplate.typePlaceholder',
    defaultMessage: 'Select Element Type',
  },
  namePlaceholder: {
    id: 'shared.components.pageBlockTemplate.namePlaceholder',
    defaultMessage: 'Name',
  },
  [BLOCK_TYPE]: {
    id: `shared.components.pageBlockTemplate.${BLOCK_TYPE}`,
    defaultMessage: 'Block Type',
  },
  blockPlaceholder: {
    id: 'shared.components.pageBlockTemplate.typePlaceholder',
    defaultMessage: 'Select Block Type',
  },
  noBlocksPlaceholder: {
    id: 'shared.components.pageBlockTemplate.noBlocksPlaceholder',
    defaultMessage: 'No blocks available',
  },
});
