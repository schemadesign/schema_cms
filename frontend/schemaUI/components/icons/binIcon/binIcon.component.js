import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import BinSVG from '../../../images/icons/bin.svg';
import { getStyles } from './binIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class BinIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <BinSVG {...restProps} style={styles} />;
  }
}

export const BinIcon = withStyles(BinIconComponent);
