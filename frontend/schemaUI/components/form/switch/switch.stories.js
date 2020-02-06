import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import PropTypes from 'prop-types';

import { Switch } from './switch.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  id: 'id',
};

export const withLabel = {
  ...defaultProps,
  label: 'label',
};

export class TestComponent extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
  };

  state = {
    value: false,
  };

  handleChange = ({ target: { checked } }) => this.setState({ value: checked });

  render() {
    console.log('this.state:', this.state);
    return <Switch onChange={this.handleChange} {...this.state} {...this.props} />;
  }
}

storiesOf('Form|Switch', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent {...defaultProps} />)
  .add('With label', () => <TestComponent {...withLabel} />);
