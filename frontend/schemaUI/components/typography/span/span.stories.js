import React from 'react';
import { storiesOf } from '@storybook/react';

import { Span } from './span.component';

storiesOf('Typography.Span', module).add('Default', () => (
  <Span>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum.
  </Span>
));

const withStylesProps = {
  customStyles: {
    color: '#fff',
    fontWeight: 'bold',
    background: 'blue',
    padding: '3px',
  },
};

storiesOf('Typography.Span', module).add('with styles', () => (
  <Span {...withStylesProps} >
    In id posuere nibh. Donec sodales, libero non fermentum aliquam, justo dui venenatis libero, eu efficitur odio sapien vel lorem.
  </Span>
));
