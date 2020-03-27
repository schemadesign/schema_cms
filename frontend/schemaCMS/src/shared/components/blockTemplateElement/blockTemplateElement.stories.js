import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplateElement } from './blockTemplateElement.component';
import { blockTemplate } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  element: blockTemplate.elements[0],
  blocksOptions: [{ label: 'block', value: 'block' }],
  index: 0,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  removeElement: Function.prototype,
  autoFocus: false,
  draggableIcon: <span>icon</span>,
};

storiesOf('BlockElementTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockTemplateElement {...defaultProps} />);
