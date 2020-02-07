import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import PropTypes from 'prop-types';

import { SelectComponent } from './select.component';
import { withTheme } from '../../../.storybook/decorators';

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
    native: PropTypes.bool,
  };

  state = { selectedOption: {}, native: false };

  onSelect = selectedOption => this.setState({ selectedOption: { ...selectedOption, selected: true } });

  render() {
    const selectedOption = this.state.selectedOption;

    const native = this.props.native || this.state.native;

    const parsedOptions = options.map(option => (option.label === selectedOption.label ? selectedOption : option));

    return (
      <div>
        <SelectComponent options={parsedOptions} onSelect={this.onSelect} native={native} />
        <br />
        <br />
        Selected: {selectedOption.label}
        <br />
        Value: {selectedOption.value}
      </div>
    );
  }
}

class TestComponentWithPlaceholder extends PureComponent {
  state = { selectedOption: '' };

  onSelect = selectedOption => this.setState({ selectedOption: { ...selectedOption, selected: true } });

  render() {
    const selectedOption = this.state.selectedOption;
    const parsedOptions = options.map(option => (option.label === selectedOption.label ? selectedOption : option));

    return (
      <div>
        <SelectComponent options={parsedOptions} onSelect={this.onSelect} placeholder="Select one" />
        <br />
        <br />
        Selected: {selectedOption.label}
        <br />
        Value: {selectedOption.value}
      </div>
    );
  }
}

storiesOf('Form/Select', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent />)
  .add('With Placeholder', () => <TestComponentWithPlaceholder />)
  .add('Native Select', () => <TestComponent native />);
