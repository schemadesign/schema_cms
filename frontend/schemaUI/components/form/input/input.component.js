import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { defaultStyles } from './input.styles';

export class Input extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };
  static defaultProps = {
    customStyles: {},
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const inputStyles = { ...defaultStyles, ...customStyles };

    return <input {...restProps} style={inputStyles} />;
  }
}
