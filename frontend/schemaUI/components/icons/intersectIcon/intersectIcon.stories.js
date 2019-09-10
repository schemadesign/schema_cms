import React from 'react';
import { storiesOf } from '@storybook/react';

import { IntersectIcon } from './intersectIcon.component';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/IntersectIcon', module)
  .add('Default', () => <IntersectIcon />)
  .add('with custom styles', () => <IntersectIcon {...customStyles} />);
