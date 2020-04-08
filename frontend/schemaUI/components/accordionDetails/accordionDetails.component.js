import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  innerRef = createRef();

  render() {
    const { children, theme } = this.props;
    const { containerStyles } = getStyles(theme);

    return (
      <AccordionPanelContext.Consumer style={containerStyles}>
        {({ open, autoHeight, customDetailsStyles }) => {
          const innerHeight = this.innerRef.current ? this.innerRef.current.offsetHeight : 0;
          const height = open ? autoHeight || innerHeight : 0;

          return (
            <div style={{ ...containerStyles, ...customDetailsStyles, height }}>
              <div ref={this.innerRef}>{children}</div>
            </div>
          );
        }}
      </AccordionPanelContext.Consumer>
    );
  }
}

export const AccordionDetails = withStyles(AccordionDetailsComponent);
