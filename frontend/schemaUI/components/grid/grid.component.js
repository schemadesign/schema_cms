import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, DEFAULT_SIZE } from './grid.styles';

export class Grid extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    size: PropTypes.number,
    children: PropTypes.any,
  };

  getFormattedSize = size => (size && size >= 0 && size <= 100 ? `${size}%` : `${DEFAULT_SIZE}%`);

  render() {
    const { size, children, customStyles } = this.props;
    const formattedSize = this.getFormattedSize(size);

    const styles = { ...containerStyles, ...customStyles, maxWidth: formattedSize, flexBasis: formattedSize };

    return <div style={styles}>{children}</div>;
  }
}
