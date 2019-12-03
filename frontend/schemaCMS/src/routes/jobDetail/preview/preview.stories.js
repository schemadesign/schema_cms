import React from 'react';
import { storiesOf } from '@storybook/react';

import { Preview } from './preview.component';
import { tableFields as fields, tableData as data } from '../../../shared/utils/dataMock';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
  previewData: { data, fields },
  fetchPreview: Function.prototype,
  history,
  intl,
  match: {
    params: {
      jobId: '1',
    },
  },
};

storiesOf('JobDetail/Preview', module)
  .addDecorator(withTheme())
  .add('Default', () => <Preview {...defaultProps} />);
