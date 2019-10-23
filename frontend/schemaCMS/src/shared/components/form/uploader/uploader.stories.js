import React from 'react';
import { storiesOf } from '@storybook/react';

import { Uploader } from './uploader.component';
import { withTheme } from '../../../../.storybook/decorators';

export const defaultProps = {
  fileName: 'file name',
  label: 'label',
  id: 'id',
  name: 'name',
  errors: {},
  onChange: Function.prototype,
};

export const withError = {
  ...defaultProps,
  errors: {
    [defaultProps.name]: 'error',
  },
};

storiesOf('Shared Components|Form/Uploader', module)
  .addDecorator(withTheme())
  .add('Default', () => <Uploader {...defaultProps} />)
  .add('With error', () => <Uploader {...withError} />);
