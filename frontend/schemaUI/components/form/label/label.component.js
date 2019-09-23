import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './label.styles';
import { withStyles } from '../../styles/withStyles';

export class LabelComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    name: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };

  static defaultProps = {
    customStyles: {},
  };

  render() {
    const { children, name, theme, customStyles, ...restProps } = this.props;
    const defaultStyles = getStyles(theme);
    const labelStyles = { ...defaultStyles, ...customStyles };

    return (
      <label {...restProps} style={labelStyles} htmlFor={name}>
        {children}
      </label>
    );
  }
}

export const Label = withStyles(LabelComponent);
