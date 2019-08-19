import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { headerStyle } from './h1.styles';

export class H1 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    style: PropTypes.object,
  };

  render() {
    const {style: componentStyle = {}, children} = this.props;
    const style = {...headerStyle, ...componentStyle};

    return <h1 style={style} >{children}</h1>;
  }
}
