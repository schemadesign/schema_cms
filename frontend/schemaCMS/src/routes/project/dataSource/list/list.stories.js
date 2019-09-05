import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter } from '../../../../.storybook/decorators';
import { List } from './list.component';

const defaultProps = {
  createDataSource: Function.prototype,
  match: {
    params: {
      projectId: '1',
    },
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('Project/DataSource/List', module)
  .addDecorator(withRouter)
  .add('Default', () => <List {...defaultProps} />);
