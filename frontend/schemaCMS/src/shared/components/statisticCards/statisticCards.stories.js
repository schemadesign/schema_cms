import React from 'react';
import { storiesOf } from '@storybook/react';
import { history } from '../../../.storybook/helpers';

import { StatisticCards } from './statisticCards.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  statistics: [{ header: 'block', value: 2, to: '/link/to', id: 'id' }],
  history,
};

storiesOf('StatisticCards', module)
  .addDecorator(withTheme())
  .add('Default', () => <StatisticCards {...defaultProps} />);
