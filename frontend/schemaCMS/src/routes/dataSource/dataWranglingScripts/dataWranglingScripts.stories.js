import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { DataWranglingScripts } from './dataWranglingScripts.component';
import { SCRIPT_TYPES } from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';

export const defaultProps = {
  dataWranglingScripts: [
    { id: 1, name: 'name 1', specs: {}, isPredefined: false, type: SCRIPT_TYPES.UPLOADED },
    { id: 2, name: 'name 2', specs: {}, isPredefined: true, type: SCRIPT_TYPES.DEFAULT },
    { id: 3, name: 'name 3', specs: { type: 'type' }, isPredefined: true, type: SCRIPT_TYPES.CUSTOM },
  ],
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
