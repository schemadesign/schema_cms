import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './button.styles';
import { withStyles } from '../styles/withStyles';

class ButtonComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    customStyles: PropTypes.object,
    theme: PropTypes.object,
    inverse: PropTypes.bool,
  };

  static defaultProps = {
    customStyles: {},
    inverse: false,
  };

  render() {
    const { children, customStyles, theme, inverse, ...restProps } = this.props;
    const buttonType = inverse ? 'inverseButton' : 'button';
    const { containerStyles } = getStyles(theme, buttonType);

    const style = { ...containerStyles, ...this.props.customStyles };
    return (
      <button {...restProps} style={style}>
        {children}
      </button>
    );
  }
}

export const Button = withStyles(ButtonComponent);
