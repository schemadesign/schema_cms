import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { DataWranglingResult } from './dataWranglingResult.component';
import { tableFields as fields, tableData as data } from '../../../shared/utils/dataMock';
import { JOB_STATE_FAILURE, JOB_STATE_SUCCESS } from '../../../modules/job/job.constants';

export const defaultProps = {
  dataSource: {
    jobs: [{ id: 1, jobState: JOB_STATE_FAILURE }, { id: 2, jobState: JOB_STATE_SUCCESS }],
    metaData: {},
  },
  previewData: {
    fields,
    data,
  },
  fetchPreview: Function.prototype,
  history,
  intl,
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      step: '4',
    },
    url: 'url',
  },
};

storiesOf('Data Source|DataWranglingResult', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataWranglingResult {...defaultProps} />);
