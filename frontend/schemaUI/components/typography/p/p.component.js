import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { light } from '../../../utils/theme';
import { containerStyles } from './p.styles';

export class P extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = light, children, ...restProps } = this.props;
    const style = { ...containerStyles, ...theme.typography.p, ...customStyles };
    const props = { style, ...restProps };

    return <p {...props}>{children}</p>;
  }
}
