import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { NotAuthorized } from './notAuthorized.component';
import { withTheme } from '../../.storybook/decorators';
import { intl } from '../../.storybook/helpers';

export const defaultProps = {
  intl,
};

storiesOf('NotAuthorized', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <NotAuthorized {...defaultProps} />);
