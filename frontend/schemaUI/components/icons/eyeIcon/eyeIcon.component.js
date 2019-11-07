import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import EyeSvg from '../../../images/icons/eye.svg';
import { getStyles } from './eyeIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class EyeIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <EyeSvg {...restProps} style={styles} />;
  }
}

export const EyeIcon = withStyles(EyeIconComponent);
