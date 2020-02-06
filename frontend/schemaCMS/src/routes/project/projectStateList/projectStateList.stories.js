import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectStateList } from './projectStateList.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  states: [
    {
      name: 'name 1',
      id: 1,
      description: 'description',
    },
    {
      name: 'name 2',
      id: 2,
      description: 'description',
    },
  ],
  fetchStates: Function.prototype,
  intl,
  history,
  match: {
    params: {
      projectId: '1',
    },
  },
};

export const noStatesProps = {
  ...defaultProps,
  states: [],
};

storiesOf('ProjectStateList', module)
  .addDecorator(withTheme())
  .add('Default', () => <ProjectStateList {...defaultProps} />)
  .add('No states', () => <ProjectStateList {...noStatesProps} />);
