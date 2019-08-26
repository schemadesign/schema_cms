import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { primary } from '../../../utils/theme';
import { headerStyles } from './h3.styles';

export class H3 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = primary, children, ...restProps } = this.props;
    const style = { ...headerStyles, ...theme.typography.h3, ...customStyles };
    const props = {style, ...restProps};

    return (
      <h3 {...props}>
        {children}
      </h3>
    );
  }
}
