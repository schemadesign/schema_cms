import React, { PureComponent } from 'react';

import { buttonStyles, containerStyles, hideStyles, showStyles } from './menu.styles';
import PropTypes from 'prop-types';
import { Button } from '../button';

export class Menu extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    open: PropTypes.bool.isRequired,
  };

  renderCloseButton = () => {
    return <Button style={buttonStyles}>close</Button>;
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
