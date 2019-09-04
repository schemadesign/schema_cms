import React from 'react';
import { storiesOf } from '@storybook/react';

import { Source } from './source.component';

const defaultProps = {
  values: {},
  onChange: Function.prototype,
  setFieldValue: Function.prototype,
};

storiesOf('Project/DataSource/View/Source', module).add('Default', () => <Source />);
