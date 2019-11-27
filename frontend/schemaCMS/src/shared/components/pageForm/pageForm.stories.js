import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageForm } from './pageForm.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  values: {
    title: 'title',
    description: 'description',
    keywords: 'keywords',
  },
  handleChange: Function.prototype,
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

storiesOf('PageForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageForm {...defaultProps} />);
