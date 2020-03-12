import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionPanel.styles';
import { withStyles } from '../styles/withStyles';
import AccordionContext from '../accordion/accordion.context';
import AccordionPanelContext from './accordionPanel.context';
import { ANIMATION_DURATION } from '../accordionDetails/accordionDetails.styles';

export class AccordionPanelComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    autoOpen: PropTypes.bool,
  };

  static defaultProps = {
    autoOpen: false,
  };

  state = {
    open: this.props.autoOpen,
    overflow: 'hidden',
  };

  togglePanel = () => {
    const open = !this.state.open;
    this.setState({ open, overflow: 'hidden' });
    if (open) {
      this.delayOverflow();
    }
  };

  delayOverflow = () => setTimeout(() => this.setState({ overflow: 'inherit' }), ANIMATION_DURATION);

  render() {
    const { children } = this.props;
    const { open, overflow } = this.state;
    const { containerStyles } = getStyles();

    return (
      <AccordionContext.Consumer>
        {({ customPanelStyles, ...rest }) => {
          return (
            <AccordionPanelContext.Provider value={{ ...rest, open, togglePanel: this.togglePanel }}>
              <div style={{ ...containerStyles, ...customPanelStyles, overflow }}>{children}</div>
            </AccordionPanelContext.Provider>
          );
        }}
      </AccordionContext.Consumer>
    );
  }
}

export const AccordionPanel = withStyles(AccordionPanelComponent);
