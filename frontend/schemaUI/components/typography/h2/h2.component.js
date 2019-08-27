import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { primary } from '../../../utils/theme';
import { headerStyles } from './h2.styles';

export class H2 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = primary, children, ...restProps } = this.props;
    const style = { ...headerStyles, ...theme.typography.h2, ...customStyles };
    const props = { style, ...restProps };

    return <h2 {...props}>{children}</h2>;
  }
}
