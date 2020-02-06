import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { light } from '../../../utils/theme';
import { headerStyles } from './h2.styles';
import { filterAllowedAttributes } from '../../../utils/helpers';

export class H2 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = light, children, ...restProps } = this.props;
    const style = { ...headerStyles, ...theme.typography.h2, ...customStyles };
    const props = { style, ...restProps };
    const filteredProps = filterAllowedAttributes('h2', props);

    return <h2 {...filteredProps}>{children}</h2>;
  }
}
