/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { CODE_TYPE, EMBED_TYPE, IMAGE_TYPE, MARKDOWN_TYPE, NONE } from '../../modules/pageBlock/pageBlock.constants';

export default defineMessages({
  title: {
    id: 'page.createPageBlock.title',
    defaultMessage: 'Page Block',
  },
  subTitle: {
    id: 'page.createPageBlock.subTitle',
    defaultMessage: 'Create',
  },
  pageBlockFieldName: {
    id: 'page.createPageBlock.pageBlockFieldName',
    defaultMessage: 'Block Name',
  },
  pageBlockFieldNamePlaceholder: {
    id: 'page.createPageBlock.pageFieldNamePlaceholder',
    defaultMessage: 'Name',
  },
  pageBlockFieldMarkdown: {
    id: 'page.createPageBlock.pageBlockFieldMarkdown',
    defaultMessage: 'Markdown Text',
  },
  pageBlockFieldMarkdownPlaceholder: {
    id: 'page.createPageBlock.pageBlockFieldMarkdownPlaceholder',
    defaultMessage: `
    # My Cool Title
    
    ## Awesome subtitle
    
    Description **bold**
    `,
  },
  pageBlockFieldCode: {
    id: 'page.createPageBlock.pageBlockFieldCode',
    defaultMessage: 'Code Snippet',
  },
  pageBlockFieldCodePlaceholder: {
    id: 'page.createPageBlock.pageBlockFieldCodePlaceholder',
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
    id: 'page.createPageBlock.pageBlockFieldEmbed',
    defaultMessage: 'Embed Code',
  },
  pageBlockFieldEmbedPlaceholder: {
    id: 'page.createPageBlock.pageBlockFieldEmbedPlaceholder',
    defaultMessage: `
    <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/avideo"
        frameborder="0"
        allowfullscreen
    />
    `,
  },
  pageBlockFieldImage: {
    id: 'page.createPageBlock.pageBlockFieldImage',
    defaultMessage: 'File Name',
  },
  pageBlockFieldType: {
    id: 'page.createPageBlock.pageBlockFieldType',
    defaultMessage: 'Type',
  },
  createPageBlock: {
    id: 'page.createPageBlock.createPageBlock',
    defaultMessage: 'Create',
  },
  cancel: {
    id: 'page.createPageBlock.cancel',
    defaultMessage: 'Cancel',
  },
  [NONE]: {
    id: `page.createPageBlock.${NONE}`,
    defaultMessage: 'Select one',
  },
  [CODE_TYPE]: {
    id: `page.createPageBlock.${CODE_TYPE}`,
    defaultMessage: 'Code Snippet',
  },
  [EMBED_TYPE]: {
    id: `page.createPageBlock.${EMBED_TYPE}`,
    defaultMessage: 'Embed',
  },
  [IMAGE_TYPE]: {
    id: `page.createPageBlock.${IMAGE_TYPE}`,
    defaultMessage: 'Image Upload',
  },
  [MARKDOWN_TYPE]: {
    id: `page.createPageBlock.${MARKDOWN_TYPE}`,
    defaultMessage: 'Markdown Text',
  },
});
