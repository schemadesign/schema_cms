import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './input.styles';
import { withStyles } from '../../styles/withStyles';
import { filterAllowedAttributes } from '../../../utils/helpers';

class InputComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };
  static defaultProps = {
    customStyles: {},
  };

  render() {
    const { customStyles, theme, inputRef, ...restProps } = this.props;
    const defaultStyles = getStyles(theme);
    const inputStyles = { ...defaultStyles, ...customStyles };
    const filteredProps = filterAllowedAttributes('input', restProps);

    return <input id={restProps.name} style={inputStyles} ref={inputRef} {...filteredProps} />;
  }
}

export const Input = withStyles(InputComponent);
