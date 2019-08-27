import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './button.styles';

export class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    customStyles: PropTypes.object,
  };

  static defaultProps = {
    customStyles: {},
  };

  render() {
    const { children, customStyles, ...restProps } = this.props;
    const style = { ...containerStyles, ...this.props.customStyles };

    return (
      <button {...restProps} style={style}>
        {children}
      </button>
    );
  }
}
