import React, { PureComponent } from 'react';

import { getStyles } from './menu.styles';
import PropTypes from 'prop-types';
import { Button } from '../button';
import { CloseIcon } from '../icons/closeIcon';
import { withStyles } from '../styles/withStyles';

export class MenuComponent extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    customStyles: PropTypes.object,
    open: PropTypes.bool,
    isDesktop: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    closeButtonProps: PropTypes.shape({
      customStyles: PropTypes.object,
      iconStyles: PropTypes.object,
    }),
  };

  static defaultProps = {
    id: '',
    customStyles: {},
    open: false,
    isDesktop: false,
    onClose: () => {},
    closeButtonProps: {
      customStyles: {},
      iconStyles: {},
    },
  };

  renderCloseButton = closeButtonStyles => {
    const { customStyles, iconStyles, ...restProps } = this.props.closeButtonProps;
    const buttonStyles = { ...closeButtonStyles, ...customStyles };

    return (
      <Button {...restProps} onClick={this.props.onClose} customStyles={buttonStyles}>
        <CloseIcon customStyles={iconStyles} />
      </Button>
    );
  };

  render() {
    const { customStyles, children, theme, open, isDesktop, id } = this.props;
    const { closeButtonStyles, containerStyles, hideStyles, showStyles } = getStyles({ theme, isDesktop });
    const animationStyles = open ? showStyles : hideStyles;
    const styles = { ...containerStyles, ...customStyles, ...animationStyles };

    return (
      <div style={styles} id={id}>
        {children}
        {this.renderCloseButton(closeButtonStyles)}
      </div>
    );
  }
}

export const Menu = withStyles(MenuComponent);
