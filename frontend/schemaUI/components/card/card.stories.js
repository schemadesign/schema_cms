import React from 'react';
import { storiesOf } from '@storybook/react';

import { Card } from './card.component';

storiesOf('Card', module).add('Default', () => (
  <Card>
    <span>This is a <b>card</b> content</span>
  </Card>
));

const withStyleProps = {
  style: {color: 'green'}
};

storiesOf('Card', module).add('with style', () => (
  <Card {...withStyleProps} >
    <p>This is a <em>green</em> card.</p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a auctor ante.
      Ut at lorem id elit elementum venenatis. Quisque vulputate sit amet odio eu dictum.
    </p>
  </Card>
));

const withHeaderProps = {
  headerComponent: <b>Header</b>
};

storiesOf('Card', module).add('with header', () => (
  <Card {...withHeaderProps} >
    <p>This is a <em>card</em> with <b>header</b> content.</p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a auctor ante.
      Ut at lorem id elit elementum venenatis. Quisque vulputate sit amet odio eu dictum.
    </p>
  </Card>
));