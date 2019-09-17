import React from 'react';
import { storiesOf } from '@storybook/react';
import { withRouter } from '../../../../../.storybook/decorators';

import { DataWrangling } from './dataWrangling.component';

export const defaultProps = {
  dataWrangling: [{ name: 'name 1', active: false }, { name: 'name 2', active: true }],
  bindSubmitForm: Function.prototype,
  match: {
    url: 'http://localhost:3000/project/view/2/datasource/view/14/3',
  },
};

storiesOf('DataWrangling', module)
  .addDecorator(withRouter)
  .add('Default', () => <DataWrangling {...defaultProps} />);
