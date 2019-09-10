import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { buttonStyles, containerStyles } from './header.styles';
import { Button } from '../button';
import { MenuIcon } from '../icons/menuIcon';

export class Header extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customButtonStyles: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    iconComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    onButtonClick: PropTypes.func,
    buttonProps: PropTypes.object,
  };

  static defaultProps = {
    iconComponent: <MenuIcon />,
    onButtonClick: () => {},
    customStyles: {},
    customButtonStyles: {},
    buttonProps: {},
  };

  renderIcon = () => {
    const { iconComponent, customButtonStyles, buttonProps } = this.props;
    const styles = { ...buttonStyles, ...customButtonStyles };

    return (
      <Button customStyles={styles} {...buttonProps}>
        {iconComponent}
      </Button>
    );
  };

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
