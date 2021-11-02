import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { DotsMenu } from './dotsMenu.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  options: [
    {
      label: 'One',
      onClick: () => {
        // eslint-disable-next-line no-console
        console.log('Option "One" pressed');
      },
    },
    {
      label: 'Two',
      onClick: () => {
        // eslint-disable-next-line no-console
        console.log('Option "Two" pressed');
      },
    },
    {
      label: 'Three',
      onClick: () => {
        // eslint-disable-next-line no-console
        console.log('Option "Three" pressed');
      },
    },
  ],
};

class TestComponent extends PureComponent {
  render() {
    return (
      <div>
        <DotsMenu {...defaultProps} />
      </div>
    );
  }
}

storiesOf('Shared Components|Form/DotsMenu', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent />);
