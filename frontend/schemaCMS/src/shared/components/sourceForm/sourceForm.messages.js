/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  name: {
    id: 'shared.components.sourceForm.name',
    defaultMessage: 'Name',
  },
  source: {
    id: 'shared.components.sourceForm.source',
    defaultMessage: 'Source Type',
  },
  csv: {
    id: 'shared.components.sourceForm.csv',
    defaultMessage: 'CSV',
  },
  googleSpreadSheet: {
    id: 'shared.components.sourceForm.googleSpreadSheet',
    defaultMessage: 'Google Spreadsheet',
  },
  fileName: {
    id: 'shared.components.sourceForm.fileName',
    defaultMessage: 'File Name',
  },
  filePlaceholder: {
    id: 'shared.components.sourceForm.filePlaceholder',
    defaultMessage: 'Select file or Drag and Drop it here',
  },
  processing: {
    id: 'shared.components.sourceForm.processing',
    defaultMessage: 'There is a script processing ongoing. Please wait until it finishes to try and upload a new file.',
  },
  uploadingError: {
    id: 'shared.components.sourceForm.uploadingError',
    defaultMessage: 'Uploading file failed. Please try again.',
  },
  uploadingFile: {
    id: 'shared.components.sourceForm.uploadingFile',
    defaultMessage: 'Uploading file in progress...',
  },
  nameDataSourceProjectNameUniqueError: {
    id: 'shared.components.sourceForm.nameDataSourceProjectNameUniqueError',
    defaultMessage: 'A data source with this name already exists in the project',
  },
  fileMaxLengthError: {
    id: 'shared.components.sourceForm.fileMaxLengthError',
    defaultMessage: "File Name shouldn't be longer than 100 characters",
  },
});
