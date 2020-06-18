import React from 'react';
import { storiesOf } from '@storybook/react';

import { CustomElement } from './customElement.component';
import { withTheme } from '../../../.storybook/decorators';
import { PLAIN_TEXT_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';

export const defaultProps = {
  valuePath: 'valuePath',
  values: [{ type: PLAIN_TEXT_TYPE, id: 1 }],
  setFieldValue: Function.prototype,
  handleChange: Function.prototype,
};

storiesOf('CustomElement', module)
  .addDecorator(withTheme())
  .add('Default', () => <CustomElement {...defaultProps} />);
