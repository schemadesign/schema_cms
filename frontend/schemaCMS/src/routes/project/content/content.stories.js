import React from 'react';
import { storiesOf } from '@storybook/react';

import { Content } from './content.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { sections } from '../../../modules/sections/sections.mocks';

export const defaultProps = {
  sections,
  fetchSections: Function.prototype,
  userRole: ROLES.ADMIN,
};

storiesOf('Content', module)
  .addDecorator(withTheme())
  .add('Default', () => <Content {...defaultProps} />);
