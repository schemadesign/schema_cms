import React from 'react';
import { storiesOf } from '@storybook/react';

import { Card } from './card.component';

const defaultProps = {};

storiesOf('Card', module).add('Default', () => (
  <Card {...defaultProps} >
    <span>This is a <b>card</b> content</span>
  </Card>
));

const extendedProps = {
  ...defaultProps,
  headerComponent: <b>Header</b>
};

storiesOf('Card', module).add('with header', () => (
  <Card {...extendedProps} >
    <p>This is a <em>card</em> with <b>header</b> content.</p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a auctor ante.
      Ut at lorem id elit elementum venenatis. Quisque vulputate sit amet odio eu dictum.
    </p>
  </Card>
));