import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CloseSVG from '../../../images/icons/close.svg';
import { getStyles } from './closeIcon.styles';
import { withStyles } from '../../styles/withStyles';

class CloseIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <CloseSVG {...restProps} style={styles} />;
  }
}

export const CloseIcon = withStyles(CloseIconComponent);
