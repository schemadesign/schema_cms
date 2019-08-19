import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, headerStyles } from './card.styles';

export class Card extends PureComponent {
  static propTypes = {
    children: PropTypes.element,
    headerComponent: PropTypes.element,
    headerStyles: PropTypes.object,
    componentStyles: PropTypes.object,
  };

  getStyles = (styles = {}, newStyles = {}) => ({...styles, ...newStyles});

  renderHeader(component) {
    if (!component) {
      return null;
    }

    const style = this.getStyles(headerStyles, this.props.headerStyles);

    return (
      <div style={style}>
          {this.props.headerComponent}
      </div>
    );
  }

  render() {
    const style = this.getStyles(containerStyles, this.props.componentStyles);

    return (
      <div style={style}>
        {this.renderHeader(this.props.headerComponent)}
        {this.props.children}
      </div>
    );
  }
}
