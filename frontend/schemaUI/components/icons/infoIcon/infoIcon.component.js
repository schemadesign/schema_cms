import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import InfoSVG from '../../../images/icons/info.svg';
import { getStyles } from './infoIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class InfoIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <InfoSVG {...restProps} style={styles} />;
  }
}

export const InfoIcon = withStyles(InfoIconComponent);
