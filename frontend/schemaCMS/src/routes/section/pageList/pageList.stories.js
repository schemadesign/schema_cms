import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageList } from './pageList.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { section, pages } from '../../../modules/sections/sections.mocks';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  project,
  section,
  pages,
  userRole: ROLES.ADMIN,
  updateSection: Function.prototype,
  removeSection: Function.prototype,
  fetchSection: Function.prototype,
  fetchPages: Function.prototype,
  copyPage: Function.prototype,
};

storiesOf('PageList', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageList {...defaultProps} />);
