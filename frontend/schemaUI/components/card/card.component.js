import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './card.styles';
import { withStyles } from '../styles/withStyles';

export class CardComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    theme: PropTypes.object,
  };

  renderHeader = (component, headerStyles) => (component ? <div style={headerStyles}>{component}</div> : null);

  render() {
    const { customStyles, headerComponent, children, theme, ...restProps } = this.props;
    const { containerStyles, headerStyles } = getStyles(theme);

    const styles = { ...containerStyles, ...customStyles };

    return (
      <div style={styles} {...restProps}>
        {this.renderHeader(headerComponent, headerStyles)}
        {children}
      </div>
    );
  }
}

export const Card = withStyles(CardComponent);
