import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { RevokedAccess } from './revokedAccess.component';
import { intl } from '../../.storybook/helpers';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  intl,
  location: {
    search: '?state=some-mail%40example.com',
  },
};

storiesOf('RevokedAccess', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <RevokedAccess {...defaultProps} />);
