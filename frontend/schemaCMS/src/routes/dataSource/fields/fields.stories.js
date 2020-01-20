import React from 'react';
import { storiesOf } from '@storybook/react';

import { Fields } from './fields.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { tableFields as fields, tableData as data } from '../../../shared/utils/dataMock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const noDataProps = {
  userRole: ROLES.ADMIN,
  fetchPreview: Function.prototype,
  previewData: {},
  dataSource: { project: { id: '1' } },
  history,
  intl,
  match: {
    params: {
      step: '2',
    },
    url: 'url',
  },
};

export const defaultProps = {
  ...noDataProps,
  previewData: { data, fields },
};

storiesOf('Data Source|Fields', module)
  .addDecorator(withTheme())
  .add('No data', () => <Fields {...noDataProps} />)
  .add('Default', () => <Fields {...defaultProps} />);
