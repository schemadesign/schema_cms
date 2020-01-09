import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { TopHeader } from './topHeader.component';

const header = {
  headerTitle: 'Projects',
  headerSubtitle: 'Overview',
};

export const defaultProps = {
  ...header,
};

export const customMenuProps = {
  ...header,
  primaryMenuItems: [
    { label: 'Primary', to: '/path', id: 'primaryId' },
    { label: 'Charts', to: '/path', id: 'chartsId' },
  ],
  secondaryMenuItems: [
    { label: 'Secondary', to: '/path', id: 'secondaryId' },
    { label: 'Click action', onClick: () => {}, id: 'clickId' },
  ],
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
  projectId: 'projectId',
};

const noProjectProps = {
  ...header,
  hideProjects: true,
};

const usersProps = {
  ...header,
  isAdmin: true,
};

storiesOf('Shared Components|Header/TopHeader', module)
  .addDecorator(withTheme())
  .add('Default', () => <TopHeader {...defaultProps} />)
  .add('Header with custom menu', () => <TopHeader {...customMenuProps} />)
  .add('Long title and subtitle', () => <TopHeader {...longProps} />)
  .add('Menu without Projects', () => <TopHeader {...noProjectProps} />)
  .add('Menu with Users', () => <TopHeader {...usersProps} />);
