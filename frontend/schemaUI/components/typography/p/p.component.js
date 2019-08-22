import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { primary } from '../../../utils/theme';
import { containerStyles } from './p.styles';

export class P extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = primary, children, ...restProps } = this.props;
    const styles = { ...containerStyles, ...theme.typography.p, ...customStyles };

    return (
      <p style={styles} {...restProps}>
        {children}
      </p>
    );
  }
}
