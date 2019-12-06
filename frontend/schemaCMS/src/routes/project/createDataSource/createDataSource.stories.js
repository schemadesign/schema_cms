import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSource } from './createDataSource.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
  createDataSource: Function.prototype,
  onDataSourceChange: Function.prototype,
  match: { params: {} },
  history,
  intl,
  match: {
    params: {
      projectId: '1',
    },
  },
};

storiesOf('Project|CreateDataSource', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSource {...defaultProps} />);
