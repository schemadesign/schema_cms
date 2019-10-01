import React from 'react';
import { storiesOf } from '@storybook/react';
import { withRouter, withTheme } from '../../../../.storybook/decorators';

import { DataWranglingScripts } from './dataWranglingScripts.component';
import { STATUS_DONE } from '../../../../modules/dataSource/dataSource.constants';

export const defaultProps = {
  dataWranglingScripts: [{ key: 'name 1' }, { key: 'name 2' }],
  dataSource: { status: STATUS_DONE },
  bindSubmitForm: Function.prototype,
  fetchDataWranglingScripts: Function.prototype,
  uploadScript: Function.prototype,
  sendUpdatedDataWranglingScript: Function.prototype,
  history: {
    push: Function.prototype,
  },
  match: {
    url: '/datasource/14/3',
    params: {
      dataSourceId: '1',
      projectId: '1',
    },
  },
};

storiesOf('DataWranglingScripts', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <DataWranglingScripts {...defaultProps} />);
