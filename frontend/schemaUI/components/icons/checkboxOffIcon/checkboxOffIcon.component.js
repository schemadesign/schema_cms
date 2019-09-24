import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckboxOffSVG from '../../../images/icons/checkbox-off.svg';
import { getStyles } from './checkboxOffIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class CheckboxOffIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <CheckboxOffSVG {...restProps} style={styles} />;
  }
}

export const CheckboxOffIcon = withStyles(CheckboxOffIconComponent);
