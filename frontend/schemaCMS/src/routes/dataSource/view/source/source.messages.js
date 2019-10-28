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
  nameUniqueError: {
    id: 'dataSource.view.source.nameError',
    defaultMessage: 'DataSource with this name already exist in project.',
  },
  processing: {
    id: 'dataSource.view.source.processing',
    defaultMessage: 'There is a script processing ongoing. Please wait until it finishes to try and upload a new file.',
  },
});
