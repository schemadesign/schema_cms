import React from 'react';
import { storiesOf } from '@storybook/react';

import { IntersectIcon } from './intersectIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/IntersectIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <IntersectIcon />)
  .add('with custom styles', () => <IntersectIcon {...customStyles} />);
