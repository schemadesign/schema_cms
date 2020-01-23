import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './card.styles';
import { withStyles } from '../styles/withStyles';
import { filterAllowedAttributes } from '../../utils/helpers';

export class CardComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    headerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    footerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    theme: PropTypes.object,
  };

  renderHeader = (component, headerStyles) => (component ? <div style={headerStyles}>{component}</div> : null);
  renderFooter = (component, footerStyles) => (component ? <div style={footerStyles}>{component}</div> : null);

  render() {
    const { customStyles, headerComponent, footerComponent, children, theme, ...restProps } = this.props;
    const { containerStyles, headerStyles, footerStyles, upperStyles } = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };
    const filteredProps = filterAllowedAttributes('div', restProps);

    return (
      <div style={styles} {...filteredProps}>
        <div style={upperStyles}>
          {this.renderHeader(headerComponent, headerStyles)}
          {children}
        </div>
        {this.renderFooter(footerComponent, footerStyles)}
      </div>
    );
  }
}

export const Card = withStyles(CardComponent);
