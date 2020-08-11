import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { getStyles, ANIMATION_DURATION } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsContentComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    customDetailsStyles: PropTypes.object,
  };

  static defaultProps = {
    customDetailsStyles: {},
    open: false,
  };

  state = {
    height: 0,
    overflow: 'hidden',
    open: false,
  };

  static getDerivedStateFromProps({ open }) {
    if (open) {
      return {
        open,
      };
    }

    return null;
  }

  componentDidUpdate({ open: prevOpen = false }) {
    const { open } = this.props;

    if (prevOpen !== open) {
      const height = (this.innerRef.current && this.innerRef.current.offsetHeight) || 0;

      this.setState({ height, overflow: 'hidden' });

      if (open) {
        this.delayOverflow();
        return;
      }

      setTimeout(() => {
        this.setState({ height: 0, overflow: 'hidden' });

        setTimeout(() => {
          this.setState({ open: false });
        }, ANIMATION_DURATION);
      }, ANIMATION_DURATION / 2);
    }
  }

  delayOverflow = () => setTimeout(() => this.setState({ overflow: 'inherit', height: 'auto' }), ANIMATION_DURATION);

  innerRef = createRef();

  render() {
    const { children, customDetailsStyles, theme } = this.props;
    const { overflow, height, open } = this.state;
    const { containerStyles } = getStyles(theme);

    return (
      <div style={{ ...containerStyles, ...customDetailsStyles, overflow, height }}>
        <div ref={this.innerRef}>{open ? children : null}</div>
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
