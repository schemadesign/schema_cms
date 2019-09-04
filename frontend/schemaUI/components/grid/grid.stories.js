import React from 'react';
import { storiesOf } from '@storybook/react';

import { Grid } from './grid.component';

const customStyles = {
  border: '1px solid black',
};

const defaultProps = {
  size: 38,
  customStyles,
};

storiesOf('Grid', module).add('Default', () => <Grid {...defaultProps}>Test</Grid>);
