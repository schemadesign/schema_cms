import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordionHeader.styles';
import AccordionPanelContext from '../accordionPanel/accordionPanel.context';
import { withStyles } from '../styles/withStyles';

export class AccordionHeaderComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.object.isRequired,
  };

  render() {
    const { children, theme } = this.props;

    return (
      <AccordionPanelContext.Consumer>
        {({ icon, togglePanel, open, customHeaderStyles }) => {
          const { containerStyles, iconContainerStyles } = getStyles({ open, theme });

          return (
            <div style={{ ...containerStyles, ...customHeaderStyles }}>
              {children}
              <div onClick={togglePanel} style={iconContainerStyles}>
                {icon}
              </div>
            </div>
          );
        }}
      </AccordionPanelContext.Consumer>
    );
  }
}

export const AccordionHeader = withStyles(AccordionHeaderComponent);
