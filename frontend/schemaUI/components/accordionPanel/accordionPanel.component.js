import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import { getStyles } from './accordionPanel.styles';
import { withStyles } from '../styles/withStyles';
import AccordionContext from '../accordion/accordion.context';
import AccordionPanelContext from './accordionPanel.context';

export class AccordionPanelComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
  };

  render() {
    const { children, theme, index } = this.props;
    const { containerStyles } = getStyles(theme);

    return (
      <AccordionContext.Consumer>
        {({ customPanelStyles, accordionsState = {}, setAccordionState, temporaryAccordionState, ...rest }) => {
          return (
            <AccordionPanelContext.Provider
              value={{
                ...rest,
                open: accordionsState[index],
                togglePanel: () => setAccordionState(index, !accordionsState[index]),
              }}
            >
              <div style={{ ...containerStyles, ...customPanelStyles }}>{children}</div>
            </AccordionPanelContext.Provider>
          );
        }}
      </AccordionContext.Consumer>
    );
  }
}

export const AccordionPanel = withStyles(AccordionPanelComponent);
