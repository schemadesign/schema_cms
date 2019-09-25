import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../../.storybook/decorators';
import { Details } from './details.component';

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
    std: 23.0332,
    top: 'Sample',
    unique: 99,
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('DataSource/View/Fields/Details', module)
  .addDecorator(withTheme())
  .add('Default', () => <Details {...defaultProps} />);
