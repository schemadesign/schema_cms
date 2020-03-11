import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { getStyles, ANIMATION_DURATION } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    overflow: 'hidden',
    height: 0,
  };

  componentDidMount() {
    if (this.innerRef.current) {
      this.setState({ height: this.innerRef.current.offsetHeight });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.innerRef.current && this.innerRef.current.offsetHeight !== this.state.height) {
      this.setState({ height: this.innerRef.current.offsetHeight, overflow: 'hidden' });
    }
  }

  delayOverflow = () => setTimeout(() => this.setState({ overflow: 'inherit' }), ANIMATION_DURATION);

  containerRef = createRef();
  innerRef = createRef();

  open = false;

  render() {
    const { children } = this.props;
    const { overflow, height } = this.state;
    const { containerStyles } = getStyles();

    return (
      <AccordionPanelContext.Consumer style={containerStyles}>
        {({ open, customDetailsStyles }) => {
          const openStyles = open ? { height, overflow } : { height: 0, overflow };
          if (this.open !== open) {
            this.open = open;

            this.setState({ overflow: 'hidden' });
            if (open) {
              this.delayOverflow();
            }
          }

          return (
            <div ref={this.containerRef} style={{ ...containerStyles, ...customDetailsStyles, ...openStyles }}>
              <div ref={this.innerRef}>{children}</div>
            </div>
          );
        }}
      </AccordionPanelContext.Consumer>
    );
  }
}

export const AccordionDetails = withStyles(AccordionDetailsComponent);
