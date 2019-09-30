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
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    customStyles: {},
    inverse: false,
    disabled: false,
  };

  render() {
    const { children, customStyles, theme, inverse, disabled, ...restProps } = this.props;
    const buttonType = inverse ? 'inverseButton' : 'button';
    const { containerStyles } = getStyles(theme, buttonType, disabled);

    const style = { ...containerStyles, ...this.props.customStyles };
    return (
      <button disabled {...restProps} style={style}>
        {children}
      </button>
    );
  }
}

export const Button = withStyles(ButtonComponent);
