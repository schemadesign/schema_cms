import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceViews } from './dataSourceViews.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  dataSource: {
    name: 'name',
  },
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

storiesOf('DataSourceViews', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceViews {...defaultProps} />);
