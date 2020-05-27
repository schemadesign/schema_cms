import React from 'react';
import { storiesOf } from '@storybook/react';

import { EditState } from './editState.component';
import { withTheme } from '../../../.storybook/decorators';

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

storiesOf('DataSourceState', module)
  .addDecorator(withTheme())
  .add('Default', () => <EditState {...defaultProps} />);
