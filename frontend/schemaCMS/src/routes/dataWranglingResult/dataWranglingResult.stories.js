import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../.storybook/decorators';
import { DataWranglingResult } from './dataWranglingResult.component';
import { tableFields as fields, tableData as previewTable } from '../../shared/utils/dataMock';

export const defaultProps = {
  dataSource: {
    jobs: [{ id: 1 }],
    metaData: {},
  },
  history: {
    push: Function.prototype,
  },
  fields,
  previewTable,
  fetchResult: Function.prototype,
  unmountResult: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      step: '4',
    },
  },
};

storiesOf('DataWranglingResult', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataWranglingResult {...defaultProps} />);
