import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionPanel.styles';
import { withStyles } from '../styles/withStyles';
import AccordionContext from '../accordion/accordion.context';
import AccordionPanelContext from './accordionPanel.context';

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
  };

  togglePanel = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { children } = this.props;
    const { open } = this.state;
    const { containerStyles } = getStyles();

    return (
      <AccordionContext.Consumer>
        {({ customPanelStyles, ...rest }) => {
          return (
            <AccordionPanelContext.Provider value={{ ...rest, open, togglePanel: this.togglePanel }}>
              <div style={{ ...containerStyles, ...customPanelStyles }}>{children}</div>
            </AccordionPanelContext.Provider>
          );
        }}
      </AccordionContext.Consumer>
    );
  }
}

export const AccordionPanel = withStyles(AccordionPanelComponent);
