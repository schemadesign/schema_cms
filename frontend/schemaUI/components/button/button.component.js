import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './button.styles';
import { withStyles } from '../styles/withStyles';

class ButtonComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  static defaultProps = {
    customStyles: {},
  };

  render() {
    const { children, customStyles, theme, ...restProps } = this.props;
    const { containerStyles } = getStyles(theme);

    const style = { ...containerStyles, ...this.props.customStyles };
    return (
      <button {...restProps} style={style}>
        {children}
      </button>
    );
  }
}

export const Button = withStyles(ButtonComponent);
