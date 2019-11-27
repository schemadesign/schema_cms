/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { CODE_TYPE, EMBED_TYPE, IMAGE_TYPE, MARKDOWN_TYPE, NONE } from '../../../modules/pageBlock/pageBlock.constants';

export default defineMessages({
  title: {
    id: 'directory.createPageBlock.title',
    defaultMessage: 'Page Block',
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
  pageBlockFieldMarkdown: {
    id: 'directory.createPageBlock.pageBlockFieldMarkdown',
    defaultMessage: 'Markdown Text',
  },
  pageBlockFieldMarkdownPlaceholder: {
    id: 'directory.createPageBlock.pageBlockFieldMarkdownPlaceholder',
    defaultMessage: `
    # My Cool Title
    
    ## Awesome subtitle
    
    Description **bold**
    `,
  },
  pageBlockFieldCode: {
    id: 'directory.createPageBlock.pageBlockFieldCode',
    defaultMessage: 'Code Snippet',
  },
  pageBlockFieldCodePlaceholder: {
    id: 'directory.createPageBlock.pageBlockFieldCodePlaceholder',
    defaultMessage: `
    <button id="my-button">
        Click Me
    </button>
    <div class="hello-div">
        Hello
    </div>
    `,
  },
  pageBlockFieldEmbed: {
    id: 'directory.createPageBlock.pageBlockFieldEmbed',
    defaultMessage: 'Embed Code',
  },
  pageBlockFieldEmbedPlaceholder: {
    id: 'directory.createPageBlock.pageBlockFieldEmbedPlaceholder',
    defaultMessage: `
    <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/q_vRX20Asqg"
        frameborder="0"
        allowfullscreen
    />
    `,
  },
  pageBlockFieldImage: {
    id: 'directory.createPageBlock.pageBlockFieldImage',
    defaultMessage: 'File Name',
  },
  pageBlockFieldType: {
    id: 'directory.createPageBlock.pageBlockFieldType',
    defaultMessage: 'Type',
  },
  createPageBlock: {
    id: 'directory.createPageBlock.createPageBlock',
    defaultMessage: 'Create',
  },
  cancel: {
    id: 'directory.createPageBlock.cancel',
    defaultMessage: 'Cancel',
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
