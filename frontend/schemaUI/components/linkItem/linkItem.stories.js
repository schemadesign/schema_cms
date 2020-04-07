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
    <LinkItem {...defaultProps}>
      <Span>test</Span>
      <H3>Item Title</H3>
    </LinkItem>
  ));
