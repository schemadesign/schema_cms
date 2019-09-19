import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { Select } from './select.component';

export const defaultProps = {
  label: 'Selector',
  name: 'selectField',
  onChange: Function.prototype,
};

const defaultOptions = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
];

class TestComponent extends PureComponent {
  state = { selectedOption: 'one' };

  handleSelect = selectedOption => this.setState({ selectedOption: selectedOption.value });

  render() {
    const { selectedOption } = this.state;
    const options = defaultOptions.map(({ value, label }) => ({
      value,
      label,
      selected: value === selectedOption,
    }));

    return (
      <div>
        <Select {...defaultProps} options={options} onSelect={this.handleSelect} />
        <br />
        <br />
        Value: {selectedOption}
      </div>
    );
  }
}

storiesOf('Shared Components/Form/Select', module).add('Default', () => <TestComponent />);
