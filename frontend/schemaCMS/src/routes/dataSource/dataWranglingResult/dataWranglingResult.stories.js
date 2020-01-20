import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { DataWranglingResult } from './dataWranglingResult.component';
import { tableData as data, tableFields as fields } from '../../../shared/utils/dataMock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  dataSource: {
    id: 1,
    activeJob: {
      id: 1,
      scripts: [{ id: 1 }, { id: 15 }],
    },
    metaData: {},
    project: { id: '1' },
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
    url: '/datasource/1/result',
  },
};

storiesOf('Data Source|DataWranglingResult', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataWranglingResult {...defaultProps} />);
