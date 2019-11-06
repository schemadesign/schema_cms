import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './userIcon.styles';
import UserSVG from '../../../images/icons/user.svg';
import { withStyles } from '../../styles/withStyles';

export class UserIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <UserSVG {...restProps} style={styles} />;
  }
}

export const UserIcon = withStyles(UserIconComponent);
