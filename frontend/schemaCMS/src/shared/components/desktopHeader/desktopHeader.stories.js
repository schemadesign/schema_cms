import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { DesktopHeader } from './desktopHeader.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.EDITOR,
  userId: 'userId',
};

const noUserProps = {
  userRole: ROLES.ADMIN,
  userId: null,
};

const titleProps = {
  ...defaultProps,
  title: 'Projects',
  userRole: ROLES.ADMIN,
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
  .add('Default', () => <DesktopHeader {...defaultProps} />)
  .add('No user', () => <DesktopHeader {...noUserProps} />)
  .add('With title', () => <DesktopHeader {...titleProps} />)
  .add('With long title', () => <DesktopHeader {...longProps} />);
