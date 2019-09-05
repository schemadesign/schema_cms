import React from 'react';
import { storiesOf } from '@storybook/react';

import { TopHeader } from './topHeader.component';

export const defaultProps = {
  title: 'Projects',
  subtitle: 'Overview',
  menu: {
    primaryItems: [{ label: 'Data Sources', to: '/path' }, { label: 'Charts', to: '/path' }],
    secondaryItems: [{ label: 'Log Out', to: '/logout' }],
  },
};

storiesOf('Shared Components/TopHeader', module).add('Default', () => <TopHeader {...defaultProps} />);
