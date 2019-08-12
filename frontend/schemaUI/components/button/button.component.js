import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './button.styles';

export class Button extends PureComponent {
  static propTypes = {};

  render() {
    return <div style={containerStyles}>Button component</div>;
  }
}
