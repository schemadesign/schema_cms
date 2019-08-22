import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { primary } from '../../../utils/theme';
import { headerStyles } from './h1.styles';

export class H1 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = primary, children, ...restProps } = this.props;
    const styles = { ...headerStyles, ...theme.typography.h1, ...customStyles };

    return (
      <h1 style={styles} {...restProps}>
        {children}
      </h1>
    );
  }
}
