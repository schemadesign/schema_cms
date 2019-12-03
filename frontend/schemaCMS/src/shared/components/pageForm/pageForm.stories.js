import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageForm } from './pageForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { intl } from '../../../.storybook/helpers';

export const defaultProps = {
  values: {
    title: 'title',
    description: 'description',
    keywords: 'keywords',
  },
  handleChange: Function.prototype,
  intl,
};

storiesOf('Shared Components|PageForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageForm {...defaultProps} />);
