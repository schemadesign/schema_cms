import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CopySVG from '../../../images/icons/copy.svg';
import { getStyles } from './copyIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class CopyIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <CopySVG {...restProps} style={styles} />;
  }
}

export const CopyIcon = withStyles(CopyIconComponent);
