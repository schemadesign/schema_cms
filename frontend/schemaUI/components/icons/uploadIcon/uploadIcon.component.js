import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles } from './uploadIcon.styles';
import UploadSVG from '../../../images/icons/upload.svg';

export class UploadIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <UploadSVG {...restProps} style={styles} />;
  }
}
