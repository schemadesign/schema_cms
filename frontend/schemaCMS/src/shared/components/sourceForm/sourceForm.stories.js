import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { SourceFormComponent } from './sourceForm.component';
import { SOURCE_TYPE_FILE } from '../../../modules/dataSource/dataSource.constants';

export const defaultProps = {
  dataSource: {
    metaData: {},
    jobs: [],
  },
  values: {
    name: 'name',
    fileName: 'fileName',
    type: SOURCE_TYPE_FILE,
  },
  theme: Theme.dark,
  handleChange: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('Shared Components|Source Form', module)
  .addDecorator(withTheme())
  .add('Default', () => <SourceFormComponent {...defaultProps} />);
