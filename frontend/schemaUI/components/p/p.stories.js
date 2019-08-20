import React from 'react';
import { storiesOf } from '@storybook/react';

import { P } from './p.component';

storiesOf('P', module).add('Default', () => (
  <P>
    Regular paragraph. Aliquam erat volutpat. Vivamus diam ex, pellentesque at ullamcorper a, vestibulum eget ex. Nunc id sollicitudin metus. Maecenas eget suscipit justo.
  </P>
));

const defaultProps = {
  customStyles: {
    color: '#111',
    fontStyle: 'italic',
    fontSize: '11px',
    lineHeight: '2em',
  },
};

storiesOf('P', module).add('with styles', () => (
  <P {...defaultProps} >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum. In id posuere nibh. Donec sodales, libero non fermentum aliquam, justo dui venenatis libero, eu efficitur odio sapien vel lorem.
  </P>
));
