import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './label.styles';
import { withStyles } from '../../styles/withStyles';
import { filterAllowedAttributes } from '../../../utils/helpers';

class LabelComponent extends PureComponent {
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
    const filteredProps = filterAllowedAttributes('label', restProps);

    return (
      <label style={labelStyles} htmlFor={name} {...filteredProps}>
        {children}
      </label>
    );
  }
}

export const Label = withStyles(LabelComponent);
