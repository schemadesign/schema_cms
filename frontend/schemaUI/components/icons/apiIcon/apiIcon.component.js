import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './apiIcon.styles';
import ApiSVG from '../../../images/icons/apiIcon.svg';
import { withStyles } from '../../styles/withStyles';

export class ApiIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <ApiSVG {...restProps} style={styles} />;
  }
}

export const ApiIcon = withStyles(ApiIconComponent);
