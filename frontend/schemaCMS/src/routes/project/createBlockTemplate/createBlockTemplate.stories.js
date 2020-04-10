import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateBlockTemplate } from './createBlockTemplate.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  createBlockTemplate: Function.prototype,
  project: {
    id: 1,
  },
};

storiesOf('CreateBlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateBlockTemplate {...defaultProps} />);
