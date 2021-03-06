import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplates } from './blockTemplates.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  blockTemplates,
  fetchBlockTemplates: Function.prototype,
  copyBlockTemplate: Function.prototype,
  project: {
    id: 1,
  },
};

storiesOf('BlockTemplates', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockTemplates {...defaultProps} />);
