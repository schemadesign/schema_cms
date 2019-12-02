import React from 'react';
import { storiesOf } from '@storybook/react';

import { Fields } from './fields.component';
import { withTheme } from '../../../.storybook/decorators';
import { tableFields as fields, tableData as data } from '../../../shared/utils/dataMock';

export const noDataProps = {
  fetchPreview: Function.prototype,
  previewData: {},
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  dataSource: {},
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      step: '2',
    },
    url: 'url',
  },
};

export const defaultProps = {
  ...noDataProps,
  previewData: { data, fields },
}

storiesOf('Data Source|Fields', module)
  .addDecorator(withTheme())
  .add('no data', () => <Fields {...noDataProps} />)
  .add('default', () => <Fields {...defaultProps} />);
