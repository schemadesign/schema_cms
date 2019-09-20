import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { light } from '../../../utils/theme';
import { containerStyles } from './pre.styles';

export class Pre extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = light, children, ...restProps } = this.props;
    const style = { ...containerStyles, ...theme.typography.pre, ...customStyles };
    const props = { style, ...restProps };

    return <pre {...props}>{children}</pre>;
  }
}
