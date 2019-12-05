import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceNavigation } from './dataSourceNavigation.component';
import { withTheme } from '../../../.storybook/decorators';
import { history } from '../../../.storybook/helpers';

export const defaultProps = {
  dataSource: {
    id: '1',
  },
  history,
  hideOnDesktop: false,
};

storiesOf('Shared Components|DataSourceNavigation', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceNavigation {...defaultProps} />);
