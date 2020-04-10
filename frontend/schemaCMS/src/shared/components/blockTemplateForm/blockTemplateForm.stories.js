import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplateForm } from './blockTemplateForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { blockTemplate } from '../../../modules/blockTemplates/blockTemplates.mocks';

export const defaultProps = {
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  setValues: Function.prototype,
  setRemoveModalOpen: Function.prototype,
  values: blockTemplate,
  isValid: true,
  title: <span>title</span>,
};

storiesOf('BlockTemplateForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <BlockTemplateForm {...defaultProps} />);
