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
  };

  static defaultProps = {
    iconComponent: <MenuIcon />,
    onButtonClick: () => {},
    customStyles: {},
    customButtonStyles: {},
  };

  renderIcon = () => {
    const { onButtonClick, iconComponent, customButtonStyles } = this.props;
    const styles = { ...buttonStyles, ...customButtonStyles };

    return (
      <Button customStyles={styles} onClick={onButtonClick}>
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
