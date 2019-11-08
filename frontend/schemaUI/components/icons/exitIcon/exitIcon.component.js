import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './exitIcon.styles';
import ExitSVG from '../../../images/icons/exit.svg';
import { withStyles } from '../../styles/withStyles';

export class ExitIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <ExitSVG {...restProps} style={styles} />;
  }
}

export const ExitIcon = withStyles(ExitIconComponent);
