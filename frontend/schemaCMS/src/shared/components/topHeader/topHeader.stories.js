import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter } from '../../../.storybook/decorators';
import { TopHeader } from './topHeader.component';

export const defaultProps = {
  headerTitle: 'Projects',
  headerSubtitle: 'Overview',
  primaryMenuItems: [{ label: 'Data Sources', to: '/path' }, { label: 'Charts', to: '/path' }],
  secondaryMenuItems: [{ label: 'Log Out', to: '/logout' }, { label: 'Click action', onClick: () => {}, id: 'id' }],
};

storiesOf('Shared Components/TopHeader', module)
  .addDecorator(withRouter)
  .add('Default', () => <TopHeader {...defaultProps} />);
