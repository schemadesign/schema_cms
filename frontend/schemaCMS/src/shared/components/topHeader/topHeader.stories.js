import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { TopHeader } from './topHeader.component';

export const defaultProps = {
  headerTitle: 'Projects',
  headerSubtitle: 'Overview',
  primaryMenuItems: [{ label: 'Data Sources', to: '/path' }, { label: 'Charts', to: '/path' }],
  secondaryMenuItems: [{ label: 'Log Out', to: '/logout' }, { label: 'Click action', onClick: () => {}, id: 'id' }],
};

const longText = `
  Mauris egestas arcu nec diam consectetur vulputate.
  Mauris rhoncus a massa in ultricies. In vel accumsan tortor.
  Donec suscipit commodo enim. Suspendisse nibh odio
`;

const longProps = {
  ...defaultProps,
  headerTitle: longText,
  headerSubtitle: longText,
};

storiesOf('Shared Components|Header/TopHeader', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <TopHeader {...defaultProps} />)
  .add('Long tiltle and subtitle', () => <TopHeader {...longProps} />);
