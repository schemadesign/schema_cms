import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { BUTTON, BUTTON_DISABLED, INVERSE_BUTTON, BUTTON_SIZES } from './button.constants';
import { getStyles } from './button.styles';
import { withStyles } from '../styles/withStyles';
import { filterAllowedAttributes } from '../../utils/helpers';

class ButtonComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    customStyles: PropTypes.object,
    theme: PropTypes.object,
    inverse: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
  };

  static defaultProps = {
    customStyles: {},
    inverse: false,
    disabled: false,
    size: BUTTON_SIZES.BIG,
  };

  getButtonType(disabled, inverse) {
    if (disabled) {
      return BUTTON_DISABLED;
    }

    return inverse ? INVERSE_BUTTON : BUTTON;
  }

  render() {
    const { children, customStyles, theme, inverse, disabled, size, ...restProps } = this.props;
    const buttonType = this.getButtonType(disabled, inverse);
    const { containerStyles } = getStyles(theme, buttonType, disabled, size);
    const style = { ...containerStyles, ...this.props.customStyles };
    const buttonProps = { disabled, ...restProps };
    const filteredProps = filterAllowedAttributes('button', buttonProps);

    return (
      <button style={style} {...filteredProps}>
        {children}
      </button>
    );
  }
}

export const Button = withStyles(ButtonComponent);
