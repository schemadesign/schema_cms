import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import StateSVG from '../../../images/icons/state.svg';
import { getStyles } from './stateIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class StateIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <StateSVG {...restProps} style={styles} />;
  }
}

export const StateIcon = withStyles(StateIconComponent);
