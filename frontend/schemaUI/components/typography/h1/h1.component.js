import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { light } from '../../../utils/theme';
import { headerStyles } from './h1.styles';

export class H1 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = light, children, ...restProps } = this.props;
    const style = { ...headerStyles, ...theme.typography.h1, ...customStyles };
    const props = { style, ...restProps };

    return <h1 {...props}>{children}</h1>;
  }
}
