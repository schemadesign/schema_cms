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
    autoHeight: 'auto',
    overflow: this.props.autoOpen ? 'inherit' : 'hidden',
  };

  togglePanel = () => {
    const open = !this.state.open;
    this.setState({ autoHeight: null });
    setTimeout(() => {
      this.setState({ open, overflow: 'hidden' });
    });
    if (open) {
      this.delayOverflow();
    }
  };

  delayOverflow = () =>
    setTimeout(() => this.setState({ overflow: 'inherit', autoHeight: 'auto' }), ANIMATION_DURATION);

  render() {
    const { children, theme } = this.props;
    const { open, overflow, autoHeight } = this.state;
    const { containerStyles } = getStyles(theme);

    return (
      <AccordionContext.Consumer>
        {({ customPanelStyles, ...rest }) => {
          return (
            <AccordionPanelContext.Provider value={{ ...rest, open, autoHeight, togglePanel: this.togglePanel }}>
              <div style={{ ...containerStyles, ...customPanelStyles, overflow }}>{children}</div>
            </AccordionPanelContext.Provider>
          );
        }}
      </AccordionContext.Consumer>
    );
  }
}

export const AccordionPanel = withStyles(AccordionPanelComponent);
