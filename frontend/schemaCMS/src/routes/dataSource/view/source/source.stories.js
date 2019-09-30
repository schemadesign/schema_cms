import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { SourceComponent } from './source.component';

export const defaultProps = {
  dataSource: {},
  theme: Theme.dark,
  bindSubmitForm: Function.prototype,
  bindSetNextDisabling: Function.prototype,
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

storiesOf('Project/DataSource/View/Source', module).add('Default', () => <SourceComponent {...defaultProps} />);
