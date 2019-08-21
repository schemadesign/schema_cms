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
    onButtonClick: PropTypes.func,
  };

  static defaultProps = {
    iconComponent: <MenuIcon />,
    onButtonClick: () => {},
    customStyles: {},
  };

  renderIcon = () => <Button onClick={this.props.onButtonClick}>{this.props.iconComponent}</Button>;

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
