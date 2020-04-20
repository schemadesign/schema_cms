import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HomeSVG from '../../../images/icons/home.svg';
import { getStyles } from './homeIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class HomeIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <HomeSVG {...restProps} style={styles} />;
  }
}

export const HomeIcon = withStyles(HomeIconComponent);
