import React from 'react';
import { storiesOf } from '@storybook/react';

import { Directory } from './directory.component';
import { withRouter } from '../../.storybook/decorators';

export const defaultProps = {
  match: {
    path: 'path',
  },
};

storiesOf('Directory', module)
  .addDecorator(withRouter)
  .add('Default', () => <Directory {...defaultProps} />);
