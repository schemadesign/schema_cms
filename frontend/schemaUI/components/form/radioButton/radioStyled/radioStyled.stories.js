import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { RadioStyled } from './radioStyled.component';
import { RadioGroup } from '../../radioGroup';

const defaultProps = {
  name: 'name',
};

class RadioStyledStory extends PureComponent {
  state = {
    value: 'radio1',
  };

  onChange = ({ target: { value } }) => this.setState({ value });

  render() {
    const { value } = this.state;
    return (
      <RadioGroup {...defaultProps} onChange={this.onChange} value={value}>
        <RadioStyled label="radio 1" value="radio1" id="label 1" selectedValue={value} />
        <RadioStyled label="radio 2" value="radio2" id="label 2" selectedValue={value} />
      </RadioGroup>
    );
  }
}

storiesOf('Form/RadioStyled', module)
  .addDecorator(withTheme())
  .add('Default', () => <RadioStyledStory />);
