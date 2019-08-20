import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { headerStyles } from './h3.styles';

export class H3 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
  };

  render() {
    const {customStyles = {}, children} = this.props;
    const styles = {...headerStyles, ...customStyles};

    return <h3 style={styles} >{children}</h3>;
  }
}

