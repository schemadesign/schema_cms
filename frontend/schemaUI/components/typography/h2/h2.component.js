import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { headerStyles } from './h2.styles';

export class H2 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
  };

  render() {
    const {customStyles = {}, children, ...restProps} = this.props;
    const styles = {...headerStyles, ...customStyles};

    return <h2 style={styles} {...restProps}>{children}</h2>;
  }
}
