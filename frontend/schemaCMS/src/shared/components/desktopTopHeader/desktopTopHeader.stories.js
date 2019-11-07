import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { DesktopTopHeader } from './desktopTopHeader.component';

export const defaultProps = {
  primaryMenuItems: [{ label: 'Data Sources', to: '/path' }, { label: 'Charts', to: '/path' }],
  secondaryMenuItems: [{ label: 'Log Out', to: '/logout' }, { label: 'Click action', onClick: () => {}, id: 'id' }],
};

const titleProps = {
  ...defaultProps,
  title: 'Projects',
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

// storiesOf('Shared Components|Header/DesktopTopHeader', module)
//   .addDecorator(withRouter)
//   .addDecorator(withTheme())
//   .add('Default', () => <DesktopTopHeader {...defaultProps} />)
//   .add('With title', () => <DesktopTopHeader {...titleProps} />)
//   .add('With long title', () => <DesktopTopHeader {...longProps} />);
