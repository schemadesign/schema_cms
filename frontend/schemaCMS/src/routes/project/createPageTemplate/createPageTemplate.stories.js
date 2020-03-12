import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePageTemplate } from './createPageTemplate.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  blockTemplates,
  createPageTemplate: Function.prototype,
  fetchBlockTemplates: Function.prototype,
};

storiesOf('CreatePageTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePageTemplate {...defaultProps} />);
