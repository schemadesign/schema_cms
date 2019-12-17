import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MinusSVG from '../../../images/icons/minus.svg';
import { getStyles } from './minusIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class MinusIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    inverse: PropTypes.bool,
  };

  static defaultProps = {
    inverse: false,
  };

  render() {
    const { customStyles, theme, inverse, ...restProps } = this.props;
    const containerStyles = getStyles(theme, inverse);
    const styles = { ...containerStyles, ...customStyles };

    return <MinusSVG {...restProps} style={styles} />;
  }
}

export const MinusIcon = withStyles(MinusIconComponent);
