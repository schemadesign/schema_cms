import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './header.styles';
import { Button } from '../button';
import { MenuIcon } from '../icons/menuIcon';

export class Header extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    iconComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    handleIconClick: PropTypes.func,
  };

  static defaultProps = {
    iconComponent: <MenuIcon />,
    handleIconClick: () => {},
    customStyles: {},
  };

  renderIcon = () => <Button onClick={this.props.handleIconClick}>{this.props.iconComponent}</Button>;

  render() {
    const style = { ...containerStyles, ...this.props.customStyles };

    return (
      <div style={style}>
        <div>{this.props.children}</div>
        {this.renderIcon()}
      </div>
    );
  }
}
