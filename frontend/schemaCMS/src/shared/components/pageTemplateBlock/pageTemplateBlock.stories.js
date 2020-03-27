import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageTemplateBlock } from './pageTemplateBlock.component';
import { withTheme } from '../../../.storybook/decorators';
import { pageTemplate } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { PAGE_TEMPLATES_BLOCKS } from '../../../modules/pageTemplates/pageTemplates.constants';

export const defaultProps = {
  block: pageTemplate[PAGE_TEMPLATES_BLOCKS][0],
  blocksOptions: [{ label: 'block name', value: 1 }],
  index: 0,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  removeBlock: Function.prototype,
  autoFocus: false,
  draggableIcon: <span>icon</span>,
};

storiesOf('PageBlockTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageTemplateBlock {...defaultProps} />);
