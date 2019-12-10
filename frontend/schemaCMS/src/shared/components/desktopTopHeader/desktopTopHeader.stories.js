import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { DesktopTopHeader } from './desktopTopHeader.component';

export const defaultProps = {
  isAdmin: false,
};

const titleProps = {
  ...defaultProps,
  title: 'Projects',
  isAdmin: true,
};

const longText = `
  Mauris egestas arcu nec diam consectetur vulputate.
  Mauris rhoncus a massa in ultricies. In vel accumsan tortor.
  Donec suscipit commodo enim. Suspendisse nibh odio
`;

const longProps = {
  ...defaultProps,
  title: longText,
};

storiesOf('Shared Components|Header/DesktopTopHeader', module)
  .addDecorator(withTheme())
  .add('Default', () => <DesktopTopHeader {...defaultProps} />)
  .add('With title', () => <DesktopTopHeader {...titleProps} />)
  .add('With long title', () => <DesktopTopHeader {...longProps} />);
