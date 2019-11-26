/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { CODE_TYPE, EMBED_TYPE, IMAGE_TYPE, MARKDOWN_TYPE, NONE } from '../../../modules/pageBlock/pageBlock.constants';

export default defineMessages({
  title: {
    id: 'directory.createPageBlock.title',
    defaultMessage: 'Page',
  },
  subTitle: {
    id: 'directory.createPageBlock.subTitle',
    defaultMessage: 'Create',
  },
  pageBlockFieldName: {
    id: 'directory.createPageBlock.pageBlockFieldName',
    defaultMessage: 'Block Name',
  },
  pageBlockFieldNamePlaceholder: {
    id: 'directory.createPageBlock.pageFieldNamePlaceholder',
    defaultMessage: 'Name',
  },
  pageBlockFieldType: {
    id: 'directory.createPageBlock.pageBlockFieldType',
    defaultMessage: 'Type',
  },
  [NONE]: {
    id: `directory.createPageBlock.${NONE}`,
    defaultMessage: 'Select one',
  },
  [CODE_TYPE]: {
    id: `directory.createPageBlock.${CODE_TYPE}`,
    defaultMessage: 'Code Snippet',
  },
  [EMBED_TYPE]: {
    id: `directory.createPageBlock.${EMBED_TYPE}`,
    defaultMessage: 'Embed',
  },
  [IMAGE_TYPE]: {
    id: `directory.createPageBlock.${IMAGE_TYPE}`,
    defaultMessage: 'Image Upload',
  },
  [MARKDOWN_TYPE]: {
    id: `directory.createPageBlock.${MARKDOWN_TYPE}`,
    defaultMessage: 'Markdown Text',
  },
});
