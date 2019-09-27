import React from 'react';
import { storiesOf } from '@storybook/react';

import { Source } from './source.component';

export const defaultProps = {
  dataSource: {},
  bindSubmitForm: Function.prototype,
  updateDataSource: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      step: '1',
    },
  },
};

storiesOf('DataSource/View/Source', module).add('Default', () => <Source {...defaultProps} />);
