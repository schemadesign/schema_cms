import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles, ANIMATION_DURATION } from './accordionDetails.styles';
import { withStyles } from '../styles/withStyles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';

export class AccordionDetailsComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    maxHeight: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    maxHeight: 200,
    height: null,
  };

  state = {
    overflow: 'inherit',
  };

  componentDidUpdate(prevProps) {
    if (prevProps.height !== this.props.height) {
      this.setState({ overflow: 'hidden' });
      setTimeout(() => this.setState({ overflow: 'inherit' }), ANIMATION_DURATION);
    }
  }

  render() {
    const { children, height, maxHeight } = this.props;
    const { overflow } = this.state;
    const transitionProperty = height ? 'height' : 'max-height';
    const { containerStyles } = getStyles({ transitionProperty });
    const heightProperty = height ? { height } : { maxHeight };
    const heightHiddenProperty = height ? { height: 0 } : { maxHeight: 0 };

    return (
      <AccordionPanelContext.Consumer style={containerStyles}>
        {({ open, customDetailsStyles }) => {
          const openStyles = open
            ? { ...heightProperty, transform: 'scaleY(1)', overflow }
            : { ...heightHiddenProperty, transform: 'scaleY(0)', overflow };

          return <div style={{ ...containerStyles, ...customDetailsStyles, ...openStyles }}>{children}</div>;
        }}
      </AccordionPanelContext.Consumer>
    );
  }
}

export const AccordionDetails = withStyles(AccordionDetailsComponent);
