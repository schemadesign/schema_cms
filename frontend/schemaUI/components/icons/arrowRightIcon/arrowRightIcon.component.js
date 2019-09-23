import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ArrowRightSVG from '../../../images/icons/arrow-right.svg';
import { getStyles } from './arrowRightIcon.styles';
import { withStyles } from '../../styles/withStyles';

class ArrowRightIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <ArrowRightSVG {...restProps} style={styles} />;
  }
}

export const ArrowRightIcon = withStyles(ArrowRightIconComponent);
