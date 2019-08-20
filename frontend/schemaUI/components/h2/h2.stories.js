import React from 'react';
import { storiesOf } from '@storybook/react';

import { H2 } from './h2.component';

storiesOf('H2', module).add('Default', () => (
  <H2>
    Some title
  </H2>
));

const defaultProps = {
  customStyles: {
    color: '#34c12d',
    textDecoration: 'line-through',
    fontSize: '20px',
  },
};

storiesOf('H2', module).add('with styles', () => (
  <H2 {...defaultProps} >
    Some title with styles
  </H2>
));