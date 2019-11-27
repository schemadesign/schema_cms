/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  steps: {
    id: 'dataWranglingScripts.steps',
    defaultMessage: '{length} {length, plural,one {Step} other {Steps}}',
  },
  errorOnUploading: {
    id: 'dataWranglingScripts.errorOnUploading',
    defaultMessage: 'Error on uploading a file.',
  },
  errorTooLongName: {
    id: 'dataWranglingScripts.errorOnUploading',
    defaultMessage: 'Script name should have maximum 50 characters.',
  },
  errorJobFailed: {
    id: 'dataWranglingScripts.errorOnUploading',
    defaultMessage: 'An error happened while trying to process the scripts.',
  },
});
