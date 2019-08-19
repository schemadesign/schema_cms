import React from 'react';
import { storiesOf } from '@storybook/react';

import { Card } from './card.component';

const defaultProps = {};

storiesOf('Card', module).add('Default', () => (
  <Card {...defaultProps} >
    <span>This is a <b>card</b> content</span>
  </Card>
));