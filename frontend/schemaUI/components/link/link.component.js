import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './link.styles';

export class Link extends PureComponent {
  static propTypes = {
    theme: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };

  render() {
    const { theme, children } = this.props;
    const { containerStyles } = getStyles(theme);

    return (
      <a {...this.props} style={containerStyles}>
        {children}
      </a>
    );
  }
}
