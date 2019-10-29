import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { FieldDetail } from './fieldDetail.component';

const long = `
  Donec at erat dictum, congue lorem at, gravida magna.
  Phasellus nulla turpis, hendrerit vulputate velit ut,
  semper condimentum libero. Maecenas sodales at nisl non pellentesque.
`;

export const defaultProps = {
  id: 'firstName',
  data: {
    someProp: null,
    count: 127,
    dtype: 'Text',
    freq: 6,
    max: 100,
    mean: 4,
    min: 1,
    std: 23.033282731964,
    sample: 'Sample',
    unique: 99,
    percentile10: long,
    percentile25: 100283.30095,
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('Shared Components|FieldDetail', module)
  .addDecorator(withTheme())
  .add('Default', () => <FieldDetail {...defaultProps} />);
