/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  CODE_TYPE,
  IMAGE_TYPE,
  MARKDOWN_TYPE,
  NONE,
  TEXT_TYPE,
  EMBED_TYPE,
} from '../../../modules/pageBlock/pageBlock.constants';

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
  pageBlockFieldText: {
    id: 'shared.components.pageBlockForm.pageBlockFieldText',
    defaultMessage: 'Text',
  },
  selectImage: {
    id: 'shared.components.pageBlockForm.selectImage',
    defaultMessage: 'Please select image(s) or Drag and Drop it here',
  },
  pageBlockFieldMarkdownPlaceholder: {
    id: 'shared.components.pageBlockForm.pageBlockFieldMarkdownPlaceholder',
    defaultMessage: `
    # My Cool Title

    ## Awesome subtitle

    Description **bold**
    `,
  },
  pageBlockFieldTextPlaceholder: {
    id: 'shared.components.pageBlockForm.pageBlockFieldTextPlaceholder',
    defaultMessage: 'Example text',
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
  filesTitle: {
    id: 'shared.components.pageBlockForm.filesTitle',
    defaultMessage: 'Current files',
  },
  [NONE]: {
    id: `shared.components.pageBlockForm.${NONE}`,
    defaultMessage: 'Select type',
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
    defaultMessage: 'Markdown',
  },
  [TEXT_TYPE]: {
    id: `shared.components.pageBlockForm.${TEXT_TYPE}`,
    defaultMessage: 'Text',
  },
});
