import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './span.styles';

export class Span extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
  };

  render() {
    const {customStyles = {}, children} = this.props;
    const styles = {...containerStyles, ...customStyles};

    return <span style={styles} >{children}</span>;
  }
}
