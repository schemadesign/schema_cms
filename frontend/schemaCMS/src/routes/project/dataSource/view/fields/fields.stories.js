import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../../../.storybook/decorators';
import { tableProps } from './previewTable/previewTable.stories';
import { Fields } from './fields.component';

export const defaultProps = {
  fields: tableProps.fields,
  previewTable: tableProps.data,
  fetchFields: Function.prototype,
  unmountFields: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
    },
  },
};

storiesOf('Project/DataSource/View/Fields', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <Fields {...defaultProps} />);
