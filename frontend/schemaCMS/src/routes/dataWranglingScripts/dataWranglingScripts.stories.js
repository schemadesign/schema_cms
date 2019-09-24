import React from 'react';
import { storiesOf } from '@storybook/react';
import { withRouter } from '../../.storybook/decorators';

import { DataWranglingScripts } from './dataWranglingScripts.component';

export const defaultProps = {
  dataWranglingScripts: [{ key: 'name 1' }, { key: 'name 2' }],
  bindSubmitForm: Function.prototype,
  fetchDataWranglingScripts: Function.prototype,
  uploadScript: Function.prototype,
  sendUpdatedDataWranglingScript: Function.prototype,
  match: {
    url: '/project/view/2/datasource/view/14/3',
    params: {
      dataSourceId: '1',
      projectId: '1',
    },
  },
};

storiesOf('DataWranglingScripts', module)
  .addDecorator(withRouter)
  .add('Default', () => <DataWranglingScripts {...defaultProps} />);
