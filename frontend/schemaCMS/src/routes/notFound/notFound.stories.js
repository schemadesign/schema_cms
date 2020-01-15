import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { NotFound } from './notFound.component';
import { withTheme } from '../../.storybook/decorators';
import { intl } from '../../.storybook/helpers';

export const defaultProps = {
  intl,
  isAdmin: true,
};

storiesOf('NotFound', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <NotFound {...defaultProps} />);
