import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceNavigation } from './dataSourceNavigation.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  dataSource: {
    id: '1',
  },
  history: {
    push: Function.prototype,
  },
  hideOnDesktop: false,
};

storiesOf('DataSourceNavigation', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceNavigation {...defaultProps} />);
