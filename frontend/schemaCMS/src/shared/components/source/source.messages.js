/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  name: {
    id: 'dataSource.view.source.name',
    defaultMessage: 'Name',
  },
  source: {
    id: 'dataSource.view.source.source',
    defaultMessage: 'Source',
  },
  spreadsheet: {
    id: 'dataSource.view.source.spreadsheet',
    defaultMessage: 'Spreadsheet',
  },
  fileName: {
    id: 'dataSource.view.source.fileName',
    defaultMessage: 'File Name',
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
  pastVersions: {
    id: 'dataSource.view.source.pastVersions',
    defaultMessage: 'View Past Versions',
  },
  removeDataSource: {
    id: 'dataSource.view.removeDataSource',
    defaultMessage: 'Delete Data Source',
  },
  cancelRemoval: {
    id: 'dataSource.view.cancelRemoval',
    defaultMessage: 'Cancel',
  },
  confirmRemoval: {
    id: 'dataSource.view.confirmRemoval',
    defaultMessage: 'Confirm',
  },
  removeTitle: {
    id: 'dataSource.view.removeTitle',
    defaultMessage: 'Are you sure you want to remove the data source?',
  },
});
