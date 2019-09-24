import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './uploadIcon.styles';
import UploadSVG from '../../../images/icons/upload.svg';
import { withStyles } from '../../styles/withStyles';

export class UploadIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <UploadSVG {...restProps} style={styles} />;
  }
}

export const UploadIcon = withStyles(UploadIconComponent);
