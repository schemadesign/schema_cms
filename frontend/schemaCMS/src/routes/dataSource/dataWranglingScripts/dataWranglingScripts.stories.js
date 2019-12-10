import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { DataWranglingScripts } from './dataWranglingScripts.component';

export const defaultProps = {
  dataWranglingScripts: [{ id: 1, name: 'name 1', specs: {} }, { id: 2, name: 'name 2', specs: {} }],
  dataSource: { metaData: {} },
  bindSubmitForm: Function.prototype,
  fetchDataWranglingScripts: Function.prototype,
  uploadScript: Function.prototype,
  imageScrapingFields: [],
  customScripts: [],
  sendUpdatedDataWranglingScript: Function.prototype,
  isAdmin: true,
  history,
  intl,
  match: {
    url: '/datasource/14/3',
    params: {
      dataSourceId: '1',
      projectId: '1',
      step: '3',
    },
  },
};

storiesOf('Data Source|DataWranglingScripts', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataWranglingScripts {...defaultProps} />);
