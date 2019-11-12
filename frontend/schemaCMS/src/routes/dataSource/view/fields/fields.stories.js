import React from 'react';
import { storiesOf } from '@storybook/react';

import { Fields } from './fields.component';
import { withTheme } from '../../../../.storybook/decorators';

export const defaultProps = {
  fetchPreview: Function.prototype,
  previewData: {},
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  dataSource: {},
  history: {},
  match: {
    params: {
      step: '1',
    },
  },
};

storiesOf('Fields', module)
  .addDecorator(withTheme())
  .add('Default', () => <Fields {...defaultProps} />);
