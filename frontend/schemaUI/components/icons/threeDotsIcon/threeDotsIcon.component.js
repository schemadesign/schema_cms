import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ThreeDotsSVG from '../../../images/icons/three-dots.svg';
import { getStyles } from './threeDotsIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class ThreeDotsIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <ThreeDotsSVG {...restProps} style={styles} />;
  }
}

export const ThreeDotsIcon = withStyles(ThreeDotsIconComponent);
