import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { Select } from './select.component';

const DEFAULT_OPTION = { value: 'default', label: 'Select one of the list', selected: true };

const options = [
  { value: 'dolphin', label: 'Dolphin' },
  { value: 'dog', label: 'Dog' },
  { value: 'parrot', label: 'Parrot' },
  { value: 'cat', label: 'Cat' },
  { value: 'alligator', label: 'Alligator' },
  { value: 'spider', label: 'Spider' },
];

class TestComponent extends PureComponent {
  state = { selectedOption: DEFAULT_OPTION };

  onSelect = selectedOption => this.setState({ selectedOption: { ...selectedOption, selected: true } });

  render() {
    const { selectedOption } = this.state;
    const parsedOptions = [...options, selectedOption];

    return <Select options={parsedOptions} onSelect={this.onSelect} />;
  }
}

storiesOf('Select', module).add('Default', () => <TestComponent />);
