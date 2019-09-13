import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataWrangling } from './dataWrangling.component';

export const defaultProps = {
  dataWrangling: [{ name: 'name 1', active: false }, { name: 'name 2', active: true }],
  bindSubmitForm: Function.prototype,
};

storiesOf('DataWrangling', module).add('Default', () => <DataWrangling {...defaultProps} />);
