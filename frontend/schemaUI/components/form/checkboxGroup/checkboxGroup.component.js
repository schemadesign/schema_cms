import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './checkboxGroup.styles';

export class CheckboxGroup extends PureComponent {
  static propTypes = {};

  render() {
    return <div style={containerStyles} >CheckboxGroup component</div>;
  }
}
