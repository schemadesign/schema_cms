import React from 'react';
import { storiesOf } from '@storybook/react';

import { LinkItem } from './linkItem.component';
import { withTheme } from '../../.storybook/decorators';
import { H3, Span } from '../typography';

export const defaultProps = {
  href: '#',
};

storiesOf('LinkItem', module)
  .addDecorator(withTheme())
  .add('Default', () => (
    <LinkItem href="#">
      <Span>Details</Span>
      <H3>This is a page</H3>
    </LinkItem>
  ))
  .add('With render function', () => (
    <LinkItem
      {...defaultProps}
      render={styles => (
        <div style={styles}>
          <Span>test</Span>
          <H3>Item Title</H3>
        </div>
      )}
    />
  ));
