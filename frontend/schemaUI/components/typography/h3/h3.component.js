import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { light } from '../../../utils/theme';
import { headerStyles } from './h3.styles';
import { filterAllowedAttributes } from '../../../utils/helpers';

export class H3 extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = light, children, ...restProps } = this.props;
    const style = { ...headerStyles, ...theme.typography.h3, ...customStyles };
    const props = { style, ...restProps };
    const filteredProps = filterAllowedAttributes('h3', props);

    return <h3 {...filteredProps}>{children}</h3>;
  }
}
