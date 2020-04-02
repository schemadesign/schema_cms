import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, getStyles } from './breadcrumbs.styles';

const SEPARATOR_SYMBOL = '>';

export class Breadcrumbs extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    theme: PropTypes.object,
    separatorSymbol: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  };

  static defaultProps = {
    ...getStyles(),
    separatorSymbol: SEPARATOR_SYMBOL,
  };

  shouldRenderSeparator = (index, length) => length > 1 && index < length;

  parseStringOr = node => (typeof node === 'string' ? `${node}` : node);

  renderSeparator = () => (
    <div style={this.props.separatorStyles}>{this.parseStringOr(this.props.separatorSymbol)}</div>
  );

  renderItem = (item, index) => (
    <div style={this.props.itemStyles} key={index}>
      {item}
      {this.shouldRenderSeparator(index + 1, this.props.children.length) ? this.renderSeparator() : null}
    </div>
  );

  render() {
    return <div style={containerStyles}>{this.props.children.map(this.renderItem)}</div>;
  }
}
