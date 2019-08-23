import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { defaultStyles } from './label.styles';

export class Label extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    name: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  static defaultProps = {
    customStyles: {},
  };

  render() {
    const { label, name, customStyles, ...restProps } = this.props;
    const labelStyles = { ...defaultStyles, ...customStyles };

    return (
      <label {...restProps} style={labelStyles} htmlFor={name}>
        {label}
      </label>
    );
  }
}
