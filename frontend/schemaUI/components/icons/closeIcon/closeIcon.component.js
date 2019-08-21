import React, { PureComponent } from 'react';

import CloseSVG from '../../../images/icons/close.svg';
import { containerStyles } from '../closeIcon/closeIcon.styles';

export class CloseIcon extends PureComponent {
  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...this.props.customStyles };

    return <CloseSVG {...restProps} style={styles} />;
  }
}
