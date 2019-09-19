import React from 'react';
import { storiesOf } from '@storybook/react';
import { withRouter } from '../../../../../.storybook/decorators';

import { DataWrangling } from './dataWrangling.component';

export const defaultProps = {
  dataWranglings: [{ key: 'name 1' }, { key: 'name 2' }],
  bindSubmitForm: Function.prototype,
  fetchDataWrangling: Function.prototype,
  uploadScript: Function.prototype,
  sendUpdatedDataWrangling: Function.prototype,
  match: {
    url: '/project/view/2/datasource/view/14/3',
    params: {
      dataSourceId: '1',
      projectId: '1',
    },
  },
};

storiesOf('DataWrangling', module)
  .addDecorator(withRouter)
  .add('Default', () => <DataWrangling {...defaultProps} />);
