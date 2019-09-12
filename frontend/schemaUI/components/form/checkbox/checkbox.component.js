import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './checkbox.styles';

export class Checkbox extends PureComponent {
  static propTypes = {};

  render() {
    return <div style={containerStyles} >Checkbox component</div>;
  }
}
