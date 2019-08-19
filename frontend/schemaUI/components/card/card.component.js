import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './card.styles';

export class Card extends PureComponent {
  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    return <div style={containerStyles}>{this.props.children}</div>;
  }
}
