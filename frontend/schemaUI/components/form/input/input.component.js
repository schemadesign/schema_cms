import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './input.styles';
import { withStyles } from '../../styles/withStyles';

class InputComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };
  static defaultProps = {
    customStyles: {},
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const defaultStyles = getStyles(theme);
    const inputStyles = { ...defaultStyles, ...customStyles };

    return <input id={restProps.name} {...restProps} style={inputStyles} />;
  }
}

export const Input = withStyles(InputComponent);
