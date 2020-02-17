import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { intl } from '../../../.storybook/helpers';
import { SourceFormComponent } from './sourceForm.component';
import { SOURCE_TYPE_FILE } from '../../../modules/dataSource/dataSource.constants';
import { JOB_STATE_SUCCESS } from '../../../modules/job/job.constants';

export const defaultProps = {
  dataSource: {
    metaData: {},
    jobs: [],
    id: 'dataSourceIdId',
    fileName: 'fileName',
  },
  jobsState: {
    lastJobStatus: JOB_STATE_SUCCESS,
  },
  values: {
    name: 'name',
    fileName: 'fileName',
    type: SOURCE_TYPE_FILE,
  },
  uploadingDataSources: [],
  theme: Theme.dark,
  handleChange: Function.prototype,
  intl,
};

storiesOf('Shared Components|Source Form', module)
  .addDecorator(withTheme())
  .add('Default', () => <SourceFormComponent {...defaultProps} />);
