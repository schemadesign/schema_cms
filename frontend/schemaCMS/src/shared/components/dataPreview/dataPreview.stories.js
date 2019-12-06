import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import DataPreview from './dataPreview.component';
import { tableData as previewTable, tableFields as fields } from '../../utils/dataMock';

const dataSource = {
  id: 1,
  project: 1,
  metaData: {},
};

export const defaultProps = {
  dataSource,
  previewData: { previewTable, fields },
  fetchPreview: Function.prototype,
  history,
  intl,
  match: {
    params: {
      step: '2',
    },
  },
};

storiesOf('Shared Components|DataPreview', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <DataPreview {...defaultProps} />);
