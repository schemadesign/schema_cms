import React from 'react';
import { storiesOf } from '@storybook/react';

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

storiesOf('Project/DataSource/View/Fields', module).add('Default', () => <Fields {...defaultProps} />);
