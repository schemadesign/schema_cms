import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MenuSVG from '../../../images/icons/menu.svg';
import { containerStyles } from './menuIcon.styles';

export class MenuIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <MenuSVG {...restProps} style={styles} />;
  }
}
