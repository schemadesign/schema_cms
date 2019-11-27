import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { BUTTON, BUTTON_DISABLED, INVERSE_BUTTON } from './button.constants';
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

  getButtonType(disabled, inverse) {
    if (disabled) {
      return BUTTON_DISABLED;
    }

    return inverse ? INVERSE_BUTTON : BUTTON;
  }

  render() {
    const { children, customStyles, theme, inverse, disabled, ...restProps } = this.props;
    const buttonType = this.getButtonType(disabled, inverse);
    const { containerStyles } = getStyles(theme, buttonType, disabled);

    const style = { ...containerStyles, ...this.props.customStyles };
    const buttonProps = { disabled, ...restProps };

    return (
      <button style={style} {...buttonProps}>
        {children}
      </button>
    );
  }
}

export const Button = withStyles(ButtonComponent);
