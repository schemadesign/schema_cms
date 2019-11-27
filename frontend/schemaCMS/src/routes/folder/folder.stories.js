import React from 'react';
import { storiesOf } from '@storybook/react';

import { Folder } from './folder.component';
import { withRouter } from '../../.storybook/decorators';

export const defaultProps = {
  match: {
    path: 'path',
  },
};

storiesOf('Folder', module)
  .addDecorator(withRouter)
  .add('Default', () => <Folder {...defaultProps} />);
