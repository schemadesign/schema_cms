import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { PROJECT_TITLE } from '../../../modules/project/project.constants';
import { Create } from './create.component';

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

storiesOf('Project/Create', module)
  .addDecorator(withTheme())
  .add('Default', () => <Create {...defaultProps} />);
