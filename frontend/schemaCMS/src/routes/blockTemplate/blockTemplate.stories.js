import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplate } from './blockTemplate.component';
import { blockTemplate, blockTemplates } from '../../modules/blockTemplates/blockTemplates.mocks';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  blockTemplate,
  blockTemplates,
  project: {
    id: 'projectId',
  },
  userRole: ROLES.ADMIN,
  updateBlockTemplate: Function.prototype,
  fetchBlockTemplate: jest.fn().mockReturnValue(Promise.resolve({ project: 'projectId' })),
  fetchBlockTemplates: Function.prototype,
};

storiesOf('BlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockTemplate {...defaultProps} />);
