import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import IntersectSVG from '../../../images/icons/intersect.svg';
import { containerStyles } from './intersectIcon.styles';

export class IntersectIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...this.props.customStyles };

    return <IntersectSVG {...restProps} style={styles} />;
  }
}
