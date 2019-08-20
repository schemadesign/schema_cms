import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, headerStyles } from './card.styles';

export class Card extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  renderHeader = (component) => component ? (
      <div style={headerStyles}>
        {component}
      </div>
    ) : null;

  render() {
    const {customStyles, headerComponent, children} = this.props;
    const styles = {...containerStyles, ...customStyles};

    return (
      <div style={styles}>
        {this.renderHeader(headerComponent)}
        {children}
      </div>
    );
  }
}
