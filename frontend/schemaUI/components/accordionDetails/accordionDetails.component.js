import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsContentComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    autoHeight: PropTypes.string,
    customDetailsStyles: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoHeight: 0,
  };

  state = {
    height: 0,
    enableTransition: false,
  };

  componentDidMount() {
    const { open } = this.props;
    if (open) {
      this.setHeight();
    }

    setTimeout(() => {
      this.setState({ enableTransition: true });
    });
  }

  componentDidUpdate() {
    this.setHeight(open);
  }

  setHeight() {
    const { open, autoHeight } = this.props;
    const height = open ? autoHeight || this.innerRef.current.offsetHeight : 0;
    this.setState({ height });
  }

  innerRef = createRef();

  render() {
    const { children, customDetailsStyles, theme } = this.props;
    const { height, enableTransition } = this.state;
    const { containerStyles } = getStyles(theme, enableTransition);

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
