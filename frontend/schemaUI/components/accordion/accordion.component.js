import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './accordion.styles';
import AccordionContext from './accordion.context';
import { CaretIcon } from '../icons';
import { withStyles } from '../styles/withStyles';

export class AccordionComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
    arrowIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customPanelStyles: PropTypes.object,
    customHeaderStyles: PropTypes.object,
    customDetailsStyles: PropTypes.object,
  };

  static defaultProps = {
    customPanelStyles: {},
    customHeaderStyles: {},
    customDetailsStyles: {},
  };

  render() {
    const { children, arrowIcon = null, customStyles, ...rest } = this.props;
    const { iconStyles } = getStyles();
    const icon = arrowIcon || <CaretIcon customStyles={iconStyles} />;
    const context = { icon, ...rest };

    return <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>;
  }
}

export const Accordion = withStyles(AccordionComponent);
