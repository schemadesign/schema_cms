import React from 'react';
import { storiesOf } from '@storybook/react';

import { NotFound } from './notFound.component';
import { intl } from '../../.storybook/helpers';

export const defaultProps = {
  intl,
};

storiesOf('NotFound', module).add('Default', () => <NotFound {...defaultProps} />);
