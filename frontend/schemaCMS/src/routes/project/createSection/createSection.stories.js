import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateSection } from './createSection.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  project: {
    id: 1,
  },
  createSection: Function.prototype,
};

storiesOf('CreateSection', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateSection {...defaultProps} />);
