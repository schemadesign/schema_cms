import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import IntersectSVG from '../../../images/icons/intersect.svg';
import { getStyles } from './intersectIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class IntersectIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <IntersectSVG {...restProps} style={styles} />;
  }
}

export const IntersectIcon = withStyles(IntersectIconComponent);
