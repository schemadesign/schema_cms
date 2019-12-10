import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { SourceComponent } from './source.component';

export const defaultProps = {
  dataSource: {
    metaData: {},
    jobs: [],
    project: 'projectId',
    id: 'dataSourceIdId',
  },
  theme: Theme.dark,
  onDataSourceChange: Function.prototype,
  removeDataSource: Function.prototype,
  isAnyJobProcessing: false,
  history,
  intl,
  match: {
    params: {
      projectId: '1',
    },
    url: 'url',
  },
};

storiesOf('Data Source|Source', module)
  .addDecorator(withTheme())
  .add('Default', () => <SourceComponent {...defaultProps} />);
