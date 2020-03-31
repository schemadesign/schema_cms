import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageList } from './pageList.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { section } from '../../../modules/sections/sections.mocks';

export const defaultProps = {
  project: {
    id: 'projectId',
  },
  section,
  userRole: ROLES.ADMIN,
  updateSection: Function.prototype,
  removeSection: Function.prototype,
};

storiesOf('PageList', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageList {...defaultProps} />);
