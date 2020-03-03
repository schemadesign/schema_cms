import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplateForm } from './blockTemplateForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { BLOCK_TEMPLATES_NAME } from '../../../modules/blockTemplates/blockTemplates.constants';

export const defaultProps = {
  handleChange: Function.prototype,
  values: {
    [BLOCK_TEMPLATES_NAME]: 'name',
  },
  title: <span>title</span>,
};

storiesOf('BlockTemplateForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockTemplateForm {...defaultProps} />);
