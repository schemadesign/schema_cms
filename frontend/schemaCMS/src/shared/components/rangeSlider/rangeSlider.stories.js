import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';

import { RangeSlider } from './rangeSlider.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  min: 0,
  max: 100,
  minValue: 10,
  maxValue: 40,
  idMin: 'idMin',
  idMax: 'idMax',
  onChange: Function.prototype,
};

class TestComponent extends PureComponent {
  state = {
    minValue: 10,
    maxValue: 40,
  };

  handleChange = ({ target }) => this.setState({ maxValue: target.value });

  render() {
    return <RangeSlider {...defaultProps} {...this.state} onChange={this.handleChange} />;
  }
}

storiesOf('RangeSlider', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent {...defaultProps} />);
