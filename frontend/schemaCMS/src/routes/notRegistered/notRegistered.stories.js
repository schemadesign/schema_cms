import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { NotRegistered } from './notRegistered.component';
import { withTheme } from '../../.storybook/decorators';
import { intl } from '../../.storybook/helpers';

export const defaultProps = {
  intl,
  location: {
    search: '?email=some-mail%40example.com',
  },
};

storiesOf('NotRegistered', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <NotRegistered {...defaultProps} />);
