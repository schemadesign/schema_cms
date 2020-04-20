import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { LinkPreview } from './linkPreview.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  placeholder: 'Add your link here',
};

const TestComponent = () => {
  const [val, setVal] = useState('');

  return (
    <div>
      <LinkPreview onChange={setVal} {...defaultProps} />
      {val}
    </div>
  );
};

storiesOf('LinkPreview', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent />);
