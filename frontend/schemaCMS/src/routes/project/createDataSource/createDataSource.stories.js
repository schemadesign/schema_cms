import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSource } from './createDataSource.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  createDataSource: Function.prototype,
  match: {
    params: {
      projectId: '1',
    },
  },
  history: { push: Function.prototype },
};

storiesOf('Project|CreateDataSource', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSource {...defaultProps} />);
