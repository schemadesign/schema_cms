import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataWrangling } from './dataWrangling.component';

export const defaultProps = {
  dataWrangling: ['dataWrangling'],
};

storiesOf('DataWrangling', module).add('Default', () => <DataWrangling {...defaultProps} />);
