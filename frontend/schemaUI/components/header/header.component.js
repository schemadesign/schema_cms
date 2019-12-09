import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './header.styles';
import { Button } from '../button';
import { MenuIcon } from '../icons/menuIcon';
import { withStyles } from '../styles/withStyles';
import { always, ifElse, equals } from 'ramda';

export class HeaderComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customButtonStyles: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    iconComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    buttonProps: PropTypes.object,
    showButton: PropTypes.bool,
  };

  static defaultProps = {
    iconComponent: <MenuIcon />,
    customStyles: {},
    customButtonStyles: {},
    buttonProps: {},
    showButton: false,
  };

  renderIcon = buttonStyles =>
    ifElse(
      equals(true),
      () => {
        const { iconComponent, customButtonStyles, buttonProps } = this.props;
        const styles = { ...buttonStyles, ...customButtonStyles };

        return (
          <Button customStyles={styles} {...buttonProps}>
            {iconComponent}
          </Button>
        );
      },
      always(null)
    )(this.props.showButton);

  render() {
    const { theme, customStyles } = this.props;
    const { buttonStyles, containerStyles } = getStyles(theme);
    const style = { ...containerStyles, ...customStyles };

    return (
      <div style={style}>
        <div>{this.props.children}</div>
        {this.renderIcon(buttonStyles)}
      </div>
    );
  }
}

export const Header = withStyles(HeaderComponent);
