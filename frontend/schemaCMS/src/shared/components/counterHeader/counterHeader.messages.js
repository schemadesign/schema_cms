/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  counter: {
    id: 'shared.components.counterHeader.counter',
    defaultMessage: '{count, plural,one {# {copy}} other {# {copy}s}}',
  },
  customCounter: {
    id: 'shared.components.counterHeader.customCounter',
    defaultMessage: '{count, plural,one {# {copy}} other {# {customPlural}}}',
  },
});
