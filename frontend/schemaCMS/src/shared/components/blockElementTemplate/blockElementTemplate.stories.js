import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockElementTemplate } from './blockElementTemplate.component';
import { blockTemplate } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  element: blockTemplate.elements[0],
  blocksOptions: [{ label: 'block', value: 'block' }],
  index: 0,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  removeElement: Function.prototype,
  draggableIcon: <span>icon</span>,
};

storiesOf('BlockElementTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockElementTemplate {...defaultProps} />);
