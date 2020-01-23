import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { light } from '../../../utils/theme';
import { filterAllowedAttributes } from '../../../utils/helpers';

export class Span extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customStyles: PropTypes.object,
    theme: PropTypes.object,
  };

  render() {
    const { customStyles = {}, theme = light, children, ...restProps } = this.props;
    const style = { ...theme.typography.span, ...customStyles };
    const props = { style, ...restProps };
    const filteredProps = filterAllowedAttributes('span', props);

    return <span {...filteredProps}>{children}</span>;
  }
}
