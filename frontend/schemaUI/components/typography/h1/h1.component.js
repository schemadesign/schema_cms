import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { headerStyles } from './h1.styles';

export class H1 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
  };

  render() {
    const {customStyles = {}, children} = this.props;
    const styles = {...headerStyles, ...customStyles};

    return <h1 style={styles} >{children}</h1>;
  }
}
