import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { intl } from '../../../.storybook/helpers';
import { Source } from './source.component';
import {
  DATA_SOURCE_FILE,
  DATA_SOURCE_NAME,
  DATA_SOURCE_RUN_LAST_JOB,
  DATA_SOURCE_TYPE,
} from '../../../modules/dataSource/dataSource.constants';

export const defaultProps = {
  dataSource: {
    metaData: {},
    jobs: [],
    project: { id: 'projectId' },
    id: 'dataSourceIdId',
  },
  intl,
  theme: Theme.dark,
  match: {
    params: {
      dataSourceId: '1',
    },
    url: '/datasource/1/source',
  },
  isSubmitting: false,
  dirty: false,
  values: {
    [DATA_SOURCE_NAME]: 'name',
    [DATA_SOURCE_TYPE]: 'file',
    [DATA_SOURCE_FILE]: 'file',
    [DATA_SOURCE_RUN_LAST_JOB]: true,
  },
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  setFieldValue: Function.prototype,
  removeDataSource: Function.prototype,
  onDataSourceChange: Function.prototype,
};

storiesOf('Data Source|Source', module)
  .addDecorator(withTheme())
  .add('Default', () => <Source {...defaultProps} />);
