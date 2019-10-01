/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'shared.components.dataPreview.pageTitle',
    defaultMessage: 'Fields',
  },
  fields: {
    id: 'shared.components.dataPreview.fields',
    defaultMessage: '{countFields} {countFields, plural,one {Field} other {Fields}}',
  },
  ofFields: {
    id: 'shared.components.dataPreview.ofFields',
    defaultMessage: '{step} of {countFields} {countFields, plural, one {Field} other {Fields}}',
  },
});
