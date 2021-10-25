import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { DotsMenu } from './dotsMenu.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  label: 'Selector',
  name: 'selectField',
  options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }, { value: 'three', label: 'Three' }],
};

class TestComponent extends PureComponent {
  state = { selectedOption: 'one' };

  handleSelect = ({ value: selectedOption }) => this.setState({ selectedOption: selectedOption });

  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <DotsMenu {...defaultProps} value={selectedOption} onSelect={this.handleSelect} />
        <br />
        <br />
        Value: {selectedOption}
      </div>
    );
  }
}

storiesOf('Shared Components|Form/DotsMenu', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent />);
