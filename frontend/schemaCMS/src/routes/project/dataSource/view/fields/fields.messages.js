/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'project.dataSource.fields.pageTitle',
    defaultMessage: 'Fields',
  },
  fields: {
    id: 'project.dataSource.fields.navigation.fields',
    defaultMessage: '{countFields} {countFields, plural,one {Field} other {Fields}}',
  },
  ofFields: {
    id: 'project.dataSource.fields.navigation.ofFields',
    defaultMessage: '{step} of {countFields} {countFields, plural, one {Field} other {Fields}}',
  },
});
