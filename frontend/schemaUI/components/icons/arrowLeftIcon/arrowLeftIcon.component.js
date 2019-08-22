import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ArrowLeftSVG from '../../../images/icons/arrow-left.svg';
import { containerStyles } from '../arrowLeftIcon/arrowLeftIcon.styles';

export class ArrowLeftIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <ArrowLeftSVG {...restProps} style={styles} />;
  }
}
