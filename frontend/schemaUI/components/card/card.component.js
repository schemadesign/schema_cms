import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyle, headerStyle } from './card.styles';

export class Card extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  renderHeader = (component) => component ? (
      <div style={headerStyle}>
        {component}
      </div>
    ) : null;

  render() {
    const {style: componentStyle = {}, headerComponent, children} = this.props;
    const style = {...containerStyle, ...componentStyle};

    return (
      <div style={style}>
        {this.renderHeader(headerComponent)}
        {children}
      </div>
    );
  }
}
