import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageForm } from './pageForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { page } from '../../../modules/page/page.mocks';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { project } from '../../../modules/project/project.mocks';
import { internalConnections } from '../../../modules/sections/sections.mocks';
import { tagCategories } from '../../../modules/tagCategory/tagCategory.mocks';
import { PAGE_TAGS } from '../../../modules/page/page.constants';

export const defaultProps = {
  handleChange: Function.prototype,
  setValues: Function.prototype,
  setFieldValue: Function.prototype,
  validateForm: Function.prototype,
  setRemoveModalOpen: Function.prototype,
  handleBlur: Function.prototype,
  values: {
    ...page,
    [PAGE_TAGS]: {},
  },
  pageTemplates,
  blockTemplates,
  isValid: true,
  title: 'title',
  pageUrl: 'pageUrl',
  project,
  internalConnections,
  tagCategories,
};

storiesOf('PageForm', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageForm {...defaultProps} />);
