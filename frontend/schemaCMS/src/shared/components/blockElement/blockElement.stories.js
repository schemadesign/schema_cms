import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockElement } from './blockElement.component';
import { textElement, stateOptions } from '../../../modules/page/page.mocks';
import { withTheme } from '../../../.storybook/decorators';
import { pagerUrlOptions } from '../../../modules/sections/sections.mocks';

export const defaultProps = {
  element: textElement,
  blockPath: 'blockPath',
  index: 0,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  validateForm: Function.prototype,
  pagerUrlOptions,
  stateOptions,
  isAdmin: true,
};

storiesOf('BlockElement', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockElement {...defaultProps} />);
