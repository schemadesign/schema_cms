import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './linkItem.styles';

import { Link } from '../link';

export class LinkItem extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.element]),
    Component: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.elementType]),
    theme: PropTypes.object,
  };

  static defaultProps = {
    Component: Link,
  };

  render() {
    const { Component, children, theme } = this.props;
    const { containerStyles } = getStyles(theme);
    return (
      <Component style={containerStyles} {...this.props}>
        {children}
      </Component>
    );
  }
}
