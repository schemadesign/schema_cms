import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ArrowLeftSVG from '../../../images/icons/arrow-left.svg';
import { getStyles } from './arrowLeftIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class ArrowLeftIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <ArrowLeftSVG {...restProps} style={styles} />;
  }
}

export const ArrowLeftIcon = withStyles(ArrowLeftIconComponent);
