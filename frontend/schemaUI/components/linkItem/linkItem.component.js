import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './linkItem.styles';

import { Link } from '../link';

export class LinkItem extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.element]),
    theme: PropTypes.object,
    render: PropTypes.func,
  };

  render() {
    const { children, theme, render } = this.props;
    const { containerStyles } = getStyles(theme);

    if (render) {
      return render(containerStyles);
    }

    return (
      <Link style={containerStyles} {...this.props}>
        {children}
      </Link>
    );
  }
}
