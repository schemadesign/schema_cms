import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';

export const defaultProps = {
  intl: {
    formatMessage: Function.prototype,
  },
  values: {},
  match: {
    params: {
      projectId: 1,
    },
  },
  history: {
    push: Function.prototype,
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
};

storiesOf('CreatePage', module).add('Default', () => <CreatePage {...defaultProps} />);
