import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectState } from './projectState.component';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  fetchState: Function.prototype,
  state: {
    project: 'projectId',
  },
  match: {
    path: 'path',
    params: {
      stateId: 'stateId',
    },
  },
};

storiesOf('ProjectState', module)
  .addDecorator(withTheme())
  .add('Default', () => <ProjectState {...defaultProps} />);
