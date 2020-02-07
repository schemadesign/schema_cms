import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CaretSVG from '../../../images/icons/caret.svg';
import { getStyles } from './caretIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class CaretIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <CaretSVG {...restProps} style={styles} />;
  }
}

export const CaretIcon = withStyles(CaretIconComponent);
