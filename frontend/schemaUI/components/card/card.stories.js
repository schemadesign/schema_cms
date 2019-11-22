import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import { Card } from './card.component';

storiesOf('Card', module).add('Default', () => (
  <Card>
    <span>
      This is a <b>card</b> content
    </span>
  </Card>
));

const withCustomStylesProps = {
  customStyles: { color: 'green' },
};

storiesOf('Card', module).add('with custom styles', () => (
  <Card {...withCustomStylesProps}>
    <Fragment>
      <p>
        This is a <em>green</em> card.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a auctor ante. Ut at lorem id elit elementum
        venenatis. Quisque vulputate sit amet odio eu dictum.
      </p>
    </Fragment>
  </Card>
));

const withHeaderProps = {
  headerComponent: <b>Header</b>,
};

storiesOf('Card', module).add('with header', () => (
  <Card {...withHeaderProps}>
    <Fragment>
      <p>
        This is a <em>card</em> with <b>header</b> content.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a auctor ante. Ut at lorem id elit elementum
        venenatis. Quisque vulputate sit amet odio eu dictum.
      </p>
    </Fragment>
  </Card>
));

const withProps = {
  headerComponent: <b style={{ color: '#d9d9f5', fontSize: '25px' }}>Header</b>,
  footerComponent: <b style={{ color: '#d9d9f5', fontSize: '25px' }}>Footer</b>,
  customStyles: {
    color: '#fff',
    backgroundColor: '#7575b3',
    borderTop: '3px dashed #38385f',
  },
  title: 'Card component',
  id: 'unique-card',
};

storiesOf('Card', module).add('with header, footer, custom styles and other attributes', () => (
  <Card {...withProps}>
    <span>
      <b>Lorem ipsum</b> dolor sit amet, consectetur adipiscing elit. Morbi a auctor ante. Ut at lorem id elit elementum
      venenatis. Quisque vulputate sit amet odio eu dictum.
    </span>
  </Card>
));
