import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddBlock } from './addBlock.component';
import { withTheme } from '../../../.storybook/decorators';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { project } from '../../../modules/project/project.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  fetchBlockTemplates: Function.prototype,
  blockTemplates,
  project,
  page: {
    id: 1,
    name: 'Test',
    section: {
      id: 1,
      title: 'Section',
    },
  },
  userRole: ROLES.ADMIN,
};

storiesOf('Page|AddBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <AddBlock {...defaultProps} />);
