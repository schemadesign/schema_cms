import React from 'react';
import { storiesOf } from '@storybook/react';

import { Create } from './create.component';
import { PROJECT_TITLE } from '../../../modules/project/project.constants';

const defaultProps = {
  values: {
    [PROJECT_TITLE]: 'title',
  },
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  setFieldValue: Function.prototype,
  touched: {},
  errors: {},
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

storiesOf('Project/Create', module).add('Default', () => <Create {...defaultProps} />);
