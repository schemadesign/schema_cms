import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import PropTypes from 'prop-types';

import { Select } from './select.component';

const DEFAULT_OPTION = { value: 'default', label: 'Select your favorite from the list', selected: true };

const options = [
  { value: 'dolphin', label: 'Dolphin' },
  { value: 'dog', label: 'Dog' },
  { value: 'parrot', label: 'Parrot' },
  { value: 'cat', label: 'Cat' },
  { value: 'alligator', label: 'Alligator' },
  { value: 'spider', label: 'Spider' },
];

class TestComponent extends PureComponent {
  static propTypes = {
    defaultOption: PropTypes.object,
    native: PropTypes.bool,
  };

  state = { selectedOption: {}, native: false };

  onSelect = selectedOption => this.setState({ selectedOption: { ...selectedOption, selected: true } });

  render() {
    const selectedOption = this.state.selectedOption;

    const native = this.props.native || this.state.native;

    const parsedOptions = [...options, selectedOption];

    return (
      <div>
        <Select options={parsedOptions} onSelect={this.onSelect} native={native} />
        <br />
        <br />
        Selected: {selectedOption.label}
        <br />
        Value: {selectedOption.value}
      </div>
    );
  }
}

class TestComponentWithDefaultOption extends PureComponent {
  state = { selectedOption: DEFAULT_OPTION };

  onSelect = selectedOption => this.setState({ selectedOption: { ...selectedOption, selected: true } });

  render() {
    const selectedOption = this.state.selectedOption;
    const parsedOptions = [...options, selectedOption];

    return (
      <div>
        <Select options={parsedOptions} onSelect={this.onSelect} />
        <br />
        <br />
        Selected: {selectedOption.label}
        <br />
        Value: {selectedOption.value}
      </div>
    );
  }
}

storiesOf('Select', module).add('Default', () => <TestComponent />);

storiesOf('Select', module).add('With Default Option', () => <TestComponentWithDefaultOption />);

storiesOf('Select', module).add('Native Select', () => <TestComponent native />);
