import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsContentComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    autoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customDetailsStyles: PropTypes.object,
  };

  static defaultProps = {
    autoHeight: 0,
    customDetailsStyles: {},
  };

  innerRef = createRef();

  render() {
    const { children, customDetailsStyles, theme, open, autoHeight } = this.props;
    const { containerStyles } = getStyles(theme);
    const offsetHeight = (this.innerRef.current && this.innerRef.current.offsetHeight) || 0;
    const height = open ? autoHeight || offsetHeight : 0;

    return (
      <div style={{ ...containerStyles, ...customDetailsStyles, height }}>
        <div ref={this.innerRef}>{children}</div>
      </div>
    );
  }
}

const AccordionDetailsContent = withStyles(AccordionDetailsContentComponent);

export class AccordionDetails extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children } = this.props;

    return (
      <AccordionPanelContext.Consumer>
        {props => <AccordionDetailsContent {...props}>{children}</AccordionDetailsContent>}
      </AccordionPanelContext.Consumer>
    );
  }
}
