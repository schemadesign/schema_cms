/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { BLOCK_NAME, BLOCK_TYPE } from '../../../modules/page/page.constants';

export default defineMessages({
  title: {
    id: 'page.addBlock.title',
    defaultMessage: 'Block',
  },
  subtitle: {
    id: 'page.addBlock.subtitle',
    defaultMessage: 'Add',
  },
  [`${BLOCK_NAME}Placeholder`]: {
    id: `page.addBlock.${BLOCK_NAME}Placeholder`,
    defaultMessage: 'Name',
  },
  [BLOCK_NAME]: {
    id: `page.addBlock.${BLOCK_NAME}`,
    defaultMessage: 'Block Name',
  },
  [BLOCK_TYPE]: {
    id: `page.addBlock.${BLOCK_TYPE}`,
    defaultMessage: 'Block Type',
  },
  [`${BLOCK_TYPE}Placeholder`]: {
    id: `page.addBlock.${BLOCK_TYPE}Placeholder`,
    defaultMessage: 'Please select a type',
  },
  back: {
    id: 'page.addBlock.back',
    defaultMessage: 'Back',
  },
  add: {
    id: 'page.addBlock.add',
    defaultMessage: 'Add',
  },
});
