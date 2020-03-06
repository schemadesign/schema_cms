import React, { PureComponent, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    detailsHeight: 0,
  };

  componentDidMount() {
    if (this.detailsRef.current) {
      this.setState({ detailsHeight: this.detailsRef.current.offsetHeight });
    }
  }

  componentDidUpdate() {
    if (this.detailsRef.current) {
      this.setState({ detailsHeight: this.detailsRef.current.offsetHeight });
    }
  }

  detailsRef = createRef();

  render() {
    const { children } = this.props;
    const { containerStyles, hiddenStyles } = getStyles();
    return (
      <AccordionPanelContext.Consumer style={containerStyles}>
        {({ open, customDetailsStyles }) => {
          const openStyles = open
            ? { height: this.state.detailsHeight, opacity: 1, visibility: 'visible' }
            : { height: 0, visibility: 'hidden' };

          return (
            <Fragment>
              <div style={{ ...containerStyles, ...customDetailsStyles, ...openStyles }}>{children}</div>
              <div style={{ ...containerStyles, ...customDetailsStyles, ...hiddenStyles }} ref={this.detailsRef}>
                {children}
              </div>
            </Fragment>
          );
        }}
      </AccordionPanelContext.Consumer>
    );
  }
}

export const AccordionDetails = withStyles(AccordionDetailsComponent);
