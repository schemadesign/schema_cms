import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockElement } from './blockElement.component';
import { textElement } from '../../../modules/page/page.mocks';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  element: textElement,
  blockPath: 'blockPath',
  index: 'index',
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
};

storiesOf('BlockElement', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockElement {...defaultProps} />);
