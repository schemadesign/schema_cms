/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  name: {
    id: 'dataSource.view.source.name',
    defaultMessage: 'Name',
  },
  source: {
    id: 'dataSource.view.source.source',
    defaultMessage: 'Source Type',
  },
  csv: {
    id: 'dataSource.view.source.csv',
    defaultMessage: 'CSV',
  },
  fileName: {
    id: 'dataSource.view.source.fileName',
    defaultMessage: 'File Name',
  },
  filePlaceholder: {
    id: 'dataSource.view.source.fileName',
    defaultMessage: 'Select file or drop here',
  },
  processing: {
    id: 'dataSource.view.source.processing',
    defaultMessage: 'There is a script processing ongoing. Please wait until it finishes to try and upload a new file.',
  },
  nameDataSourceProjectNameUniqueError: {
    id: 'dataSource.view.source.nameDataSourceProjectNameUniqueError',
    defaultMessage: 'A data source with this name already exists in the project',
  },
  fileMaxLengthError: {
    id: 'dataSource.view.source.fileMaxLengthError',
    defaultMessage: "File Name shouldn't be longer than 100 characters",
  },
});
