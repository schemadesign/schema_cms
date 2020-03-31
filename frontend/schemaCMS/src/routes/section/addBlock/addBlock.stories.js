import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddBlock } from './addBlock.component';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { project } from '../../../modules/project/project.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  fetchBlockTemplates: Function.prototype,
  blockTemplates,
  project,
  userRole: ROLES.ADMIN,
};

storiesOf('Section|AddBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <AddBlock {...defaultProps} />);
