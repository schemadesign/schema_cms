import React, { PureComponent } from 'react';

import { closeButtonStyles, containerStyles, hideStyles, showStyles } from './menu.styles';
import PropTypes from 'prop-types';
import { Button } from '../button';
import { CloseIcon } from '../icons/closeIcon';

export class Menu extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    customCloseButtonStyles: PropTypes.object,
    customCloseIconStyles: PropTypes.object,
    customStyles: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
  };

  static defaultProps = {
    customCloseButtonStyles: {},
    customStyles: {},
    open: false,
    onClose: () => {},
  };

  renderCloseButton = () => {
    const buttonStyles = { ...closeButtonStyles, ...this.props.customCloseButtonStyles };

    return (
      <Button class="close-menu-button" onClick={this.props.onClose} customStyles={buttonStyles}>
        <CloseIcon customStyles={this.props.customCloseIconStyles} />
      </Button>
    );
  };

  render() {
    const { customStyles, children, open } = this.props;

    const animationStyles = open ? showStyles : hideStyles;
    const styles = { ...containerStyles, ...customStyles, ...animationStyles };

    return (
      <div style={styles}>
        {children}
        {this.renderCloseButton()}
      </div>
    );
  }
}
