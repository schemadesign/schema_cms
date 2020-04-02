import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './breadcrumbs.styles';

const SEPARATOR_SYMBOL = '>';

export class Breadcrumbs extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.element,
      PropTypes.elementType,
    ]).isRequired,
    theme: PropTypes.object,
    separatorSymbol: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  };

  static defaultProps = {
    separatorSymbol: SEPARATOR_SYMBOL,
  };

  shouldRenderSeparator = (index, length) => length > 1 && index < length;

  parseStringOr = node => (typeof node === 'string' ? `${node}` : node);

  renderSeparator = () => {
    const { separatorStyles } = getStyles(this.props.theme);
    return <div style={separatorStyles}>{this.parseStringOr(this.props.separatorSymbol)}</div>;
  };

  renderItem = (item, index) => {
    const { itemStyles } = getStyles(this.props.theme);

    return (
      <div style={itemStyles} key={index}>
        {item}
        {this.shouldRenderSeparator(index + 1, this.props.children.length) ? this.renderSeparator() : null}
      </div>
    );
  };

  render() {
    const { containerStyles } = getStyles(this.props.theme);
    return <div style={containerStyles}>{this.props.children.map(this.renderItem)}</div>;
  }
}
