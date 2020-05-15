import React from 'react';
import { storiesOf } from '@storybook/react';

import { TagSearch } from './tagSearch.component';
import { tagCategories } from '../../../modules/tagCategory/tagCategory.mocks';

export const defaultProps = {
  setFieldValue: Function.prototype,
  tagCategories,
  values: {
    4: [
      {
        value: 'Blue',
      },
    ],
  },
};

storiesOf('TagSearch', module).add('Default', () => <TagSearch {...defaultProps} />);
