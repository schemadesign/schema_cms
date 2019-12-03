import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceViews } from './dataSourceViews.component';
import { withTheme } from '../../../.storybook/decorators';
import { intl } from '../../../.storybook/helpers';

export const defaultProps = {
  dataSource: {
    name: 'name',
  },
  intl,
  match: {
    url: 'url',
  },
};

storiesOf('Data Source|DataSourceViews', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceViews {...defaultProps} />);
