import React from 'react';
import { storiesOf } from '@storybook/react';

import { Pre } from './pre.component';

storiesOf('Typography/Pre', module).add('Default', () => <Pre>df.columns = map(str.lower, df.columns)</Pre>);

const withStylesProps = {
  customStyles: {
    color: 'orange',
    fontSize: '12px',
  },
};

storiesOf('Typography/Pre', module).add('with styles', () => (
  <Pre {...withStylesProps}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum. In id posuere nibh. Donec
    sodales, libero non fermentum aliquam, justo dui venenatis libero, eu efficitur odio sapien vel lorem.
  </Pre>
));
