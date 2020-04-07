import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateBlockTemplate } from './createBlockTemplate.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  blockTemplates,
  createBlockTemplate: Function.prototype,
  fetchBlockTemplates: Function.prototype,
  project: {
    id: 1,
  },
};

storiesOf('CreateBlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateBlockTemplate {...defaultProps} />);
