import React from 'react';
import { storiesOf } from '@storybook/react';

import { StatisticCards } from './statisticCards.component';

const defaultProps = {};

storiesOf('StatisticCards', module).add('Default', () => <StatisticCards {...defaultProps} />);
