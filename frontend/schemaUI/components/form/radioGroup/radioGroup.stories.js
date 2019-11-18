import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { RadioGroup } from './radioGroup.component';
import { RadioBaseComponent } from '../radioButton/radioBase/radioBase.component';
import { PlusIcon } from '../../icons/plusIcon';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = {
  name: 'name',
  value: 'radio 1',
  customStyles: {
    flexDirection: 'row',
  },
  customLabelStyles: {
    opacity: 0.1,
  },
  customCheckedStyles: {
    opacity: 1,
  },
  onChange: Function.prototype,
};

class RadioGroupStory extends PureComponent {
  state = {
    value: null,
  };

  onChange = ({ target: { value } }) => this.setState({ value });

  render() {
    return (
      <RadioGroup {...defaultProps} onChange={this.onChange} value={this.state}>
        <RadioBaseComponent label="radio 1" value="radio 1" id="label 1">
          <PlusIcon />
        </RadioBaseComponent>
        <RadioBaseComponent label="radio 2" value="radio 2" id="label 2">
          <PlusIcon />
        </RadioBaseComponent>
      </RadioGroup>
    );
  }
}

storiesOf('Form/RadioGroup', module)
  .addDecorator(withTheme())
  .add('Default', () => <RadioGroupStory />);
