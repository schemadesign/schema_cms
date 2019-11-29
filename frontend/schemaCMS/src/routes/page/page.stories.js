import React from 'react';
import { storiesOf } from '@storybook/react';

import { Page } from './page.component';
import { withRouter } from '../../.storybook/decorators';

export const defaultProps = {
  match: {
    path: 'path',
  },
};

storiesOf('Page|Page', module)
  .addDecorator(withRouter)
  .add('Default', () => <Page {...defaultProps} />);
