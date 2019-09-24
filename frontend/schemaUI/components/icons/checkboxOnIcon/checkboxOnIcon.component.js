import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckboxOnSVG from '../../../images/icons/checkbox-on.svg';
import { getStyles } from './checkboxOnIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class CheckboxOnIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <CheckboxOnSVG {...restProps} style={styles} />;
  }
}

export const CheckboxOnIcon = withStyles(CheckboxOnIconComponent);
