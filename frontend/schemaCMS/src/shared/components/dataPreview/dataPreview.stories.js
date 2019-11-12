import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import DataPreview from './dataPreview.component';
import { tableData as previewTable, tableFields as fields } from '../../utils/dataMock';

const dataSource = {
  id: 1,
  project: 1,
  metaData: {},
};

export const defaultProps = {
  previewData: { previewTable, fields },
  fetchPreview: Function.prototype,
  match: {
    params: {
      step: '2',
    },
  },
  history: {
    push: Function.prototype,
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  dataSource,
};

storiesOf('Shared Components|Fields', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <DataPreview {...defaultProps} />);
