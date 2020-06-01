import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSourceState } from './createDataSourceState.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  fetchFilters: Function.prototype,
  fetchDataSourceTags: Function.prototype,
  createState: Function.prototype,
  dataSourceTags: [],
  filters: [],
};

storiesOf('DataSource|CreateDataSourceState', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSourceState {...defaultProps} />);
