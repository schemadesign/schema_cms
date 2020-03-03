import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplate } from './blockTemplate.component';
import { blockTemplate } from '../../modules/blockTemplates/blockTemplates.mocks';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  blockTemplate,
  project: {
    id: 'projectId',
  },
  userRole: ROLES.ADMIN,
  fetchBlockTemplate: Function.prototype,
  updateBlockTemplate: Function.prototype,
};

storiesOf('BlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockTemplate {...defaultProps} />);
