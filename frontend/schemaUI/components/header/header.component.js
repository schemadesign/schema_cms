import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './header.styles';

export class Header extends PureComponent {
  static propTypes = {};

  render() {
    return <div style={containerStyles} >Header component</div>;
  }
}
