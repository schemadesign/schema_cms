/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  fields: {
    id: 'shared.components.dataPreview.fields',
    defaultMessage: '{countFields, plural,one {# Field} other {# Fields}}',
  },
  ofFields: {
    id: 'shared.components.dataPreview.ofFields',
    defaultMessage: '{step} of {countFields, plural, one {# Field} other {# Fields}}',
  },
});
