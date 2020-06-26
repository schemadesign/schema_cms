import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplate } from './blockTemplate.component';
import { blockTemplate } from '../../modules/blockTemplates/blockTemplates.mocks';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../.storybook/decorators';
import { project } from '../../modules/project/project.mocks';

export const defaultProps = {
  blockTemplate,
  project,
  userRole: ROLES.ADMIN,
  updateBlockTemplate: Function.prototype,
  copyBlockTemplate: Function.prototype,
  fetchBlockTemplate: jest.fn().mockReturnValue(Promise.resolve({ project: 'projectId' })),
  removeBlockTemplate: jest.fn().mockReturnValue(Promise.resolve({})),
  fetchProject: jest.fn().mockReturnValue(Promise.resolve({})),
};

storiesOf('BlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockTemplate {...defaultProps} />);
