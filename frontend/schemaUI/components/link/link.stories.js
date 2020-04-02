import React from 'react';
import { storiesOf } from '@storybook/react';

import { Link } from './link.component';

export const defaultProps = {
  href: '#',
  target: '_blank',
};

storiesOf('Link', module).add('Default', () => <Link {...defaultProps}>This is a Link</Link>);
