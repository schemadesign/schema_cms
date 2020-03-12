import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    height: 0,
  };

  componentDidMount() {
    if (this.innerRef.current) {
      this.setState({ height: this.innerRef.current.offsetHeight });
    }
  }

  componentDidUpdate() {
    if (this.innerRef.current && this.innerRef.current.offsetHeight !== this.state.height) {
      this.setState({ height: this.innerRef.current.offsetHeight });
    }
  }

  containerRef = createRef();
  innerRef = createRef();

  render() {
    const { children } = this.props;
    const { containerStyles } = getStyles();

    return (
      <AccordionPanelContext.Consumer style={containerStyles}>
        {({ open, customDetailsStyles }) => {
          const height = open ? this.state.height : 0;

          return (
            <div ref={this.containerRef} style={{ ...containerStyles, ...customDetailsStyles, height }}>
              <div ref={this.innerRef}>{children}</div>
            </div>
          );
        }}
      </AccordionPanelContext.Consumer>
    );
  }
}

export const AccordionDetails = withStyles(AccordionDetailsComponent);
