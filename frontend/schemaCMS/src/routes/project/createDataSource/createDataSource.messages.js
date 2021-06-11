/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'project.createDataSource.title',
    defaultMessage: 'New Data Source',
  },
  subTitle: {
    id: 'project.createDataSource.subTitle',
    defaultMessage: 'Create',
  },
  pageTitle: {
    id: 'project.createDataSource.pageTitle',
    defaultMessage: 'Create Data Source',
  },
  save: {
    id: 'project.createDataSource.save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'project.createDataSource.cancel',
    defaultMessage: 'Cancel',
  },
  nameDataSourceProjectNameUniqueError: {
    id: 'project.createDataSource.nameDataSourceProjectNameUniqueError',
    defaultMessage: 'A data source with this name already exists in project',
  },
  apiUrlApiUnableToConnectError: {
    id: 'project.createDataSource.apiUrlApiUnableToConnectError',
    defaultMessage: 'Unable to connect with provided api',
  },
  apiUrlApiNotPublicError: {
    id: 'project.createDataSource.apiUrlApiNotPublicError',
    defaultMessage: 'Only public apis are allowed',
  },
  apiUrlApiWrongFormatError: {
    id: 'project.createDataSource.apiUrlApiWrongFormatError',
    defaultMessage: 'Api returns wrong data format',
  },
});
