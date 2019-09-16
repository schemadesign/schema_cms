import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CloseSVG from '../../../images/icons/close.svg';
import { containerStyles } from './closeIcon.styles';

export class CloseIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <CloseSVG {...restProps} style={styles} />;
  }
}
