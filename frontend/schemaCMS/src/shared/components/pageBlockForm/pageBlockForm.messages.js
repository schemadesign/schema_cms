/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { CODE_TYPE, EMBED_TYPE, IMAGE_TYPE, MARKDOWN_TYPE, NONE } from '../../../modules/pageBlock/pageBlock.constants';

export default defineMessages({
  pageBlockFieldName: {
    id: 'shared.components.pageBlockForm.pageBlockFieldName',
    defaultMessage: 'Block Name',
  },
  pageBlockFieldNamePlaceholder: {
    id: 'shared.components.pageBlockForm.pageFieldNamePlaceholder',
    defaultMessage: 'Name',
  },
  pageBlockFieldMarkdown: {
    id: 'shared.components.pageBlockForm.pageBlockFieldMarkdown',
    defaultMessage: 'Markdown Text',
  },
  pageBlockFieldMarkdownPlaceholder: {
    id: 'shared.components.pageBlockForm.pageBlockFieldMarkdownPlaceholder',
    defaultMessage: `
    # My Cool Title
    
    ## Awesome subtitle
    
    Description **bold**
    `,
  },
  pageBlockFieldCode: {
    id: 'shared.components.pageBlockForm.pageBlockFieldCode',
    defaultMessage: 'Code Snippet',
  },
  pageBlockFieldCodePlaceholder: {
    id: 'shared.components.pageBlockForm.pageBlockFieldCodePlaceholder',
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
    id: 'shared.components.pageBlockForm.pageBlockFieldEmbed',
    defaultMessage: 'Embed Code',
  },
  pageBlockFieldEmbedPlaceholder: {
    id: 'shared.components.pageBlockForm.pageBlockFieldEmbedPlaceholder',
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
    id: 'shared.components.pageBlockForm.pageBlockFieldImage',
    defaultMessage: 'File Name',
  },
  pageBlockFieldType: {
    id: 'shared.components.pageBlockForm.pageBlockFieldType',
    defaultMessage: 'Type',
  },
  changeTypeModalTitle: {
    id: 'shared.components.pageBlockForm.changeTypeModalTitle',
    defaultMessage: 'Are you sure you want to change the block type? Your data may be lost in the process.',
  },
  confirm: {
    id: 'shared.components.pageBlockForm.confirm',
    defaultMessage: 'Confirm',
  },
  cancel: {
    id: 'shared.components.pageBlockForm.cancel',
    defaultMessage: 'Cancel',
  },
  [NONE]: {
    id: `shared.components.pageBlockForm.${NONE}`,
    defaultMessage: 'Select one',
  },
  [CODE_TYPE]: {
    id: `shared.components.pageBlockForm.${CODE_TYPE}`,
    defaultMessage: 'Code Snippet',
  },
  [EMBED_TYPE]: {
    id: `shared.components.pageBlockForm.${EMBED_TYPE}`,
    defaultMessage: 'Embed',
  },
  [IMAGE_TYPE]: {
    id: `shared.components.pageBlockForm.${IMAGE_TYPE}`,
    defaultMessage: 'Image Upload',
  },
  [MARKDOWN_TYPE]: {
    id: `shared.components.pageBlockForm.${MARKDOWN_TYPE}`,
    defaultMessage: 'Markdown Text',
  },
});
