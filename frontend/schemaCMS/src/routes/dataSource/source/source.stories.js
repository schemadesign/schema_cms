import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { SourceComponent } from './source.component';

export const defaultProps = {
  dataSource: {
    metaData: {},
    jobs: [],
  },
  theme: Theme.dark,
  onDataSourceChange: Function.prototype,
  removeDataSource: Function.prototype,
  history: {
    push: Function.prototype,
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  match: {
    params: {
      projectId: '1',
    },
  },
};

storiesOf('Shared Components|Source', module)
  .addDecorator(withTheme())
  .add('Default', () => <SourceComponent {...defaultProps} />);
