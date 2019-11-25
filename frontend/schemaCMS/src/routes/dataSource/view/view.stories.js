import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  dataSource: {
    project: '1',
    metaData: {},
  },
  previewData: {},
  dataWranglingScripts: [],
  filters: [],
  isAnyJobProcessing: false,
  isAdmin: true,
  fetchFields: Function.prototype,
  onDataSourceChange: Function.prototype,
  setFilters: Function.prototype,
  fetchFilters: Function.prototype,
  unmountFields: Function.prototype,
  fetchDataSource: Function.prototype,
  removeDataSource: Function.prototype,
  fetchPreview: Function.prototype,
  fetchDataWranglingScripts: Function.prototype,
  uploadScript: Function.prototype,
  sendUpdatedDataWranglingScript: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      dataSourceId: '1',
      step: '1',
    },
  },
};

storiesOf('Data Source|View', module)
  .addDecorator(withTheme())
  .add('Default', () => <View {...defaultProps} />);
