import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MenuSVG from '../../../images/icons/menu.svg';
import { getStyles } from './menuIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class MenuIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <MenuSVG {...restProps} style={styles} />;
  }
}

export const MenuIcon = withStyles(MenuIconComponent);
