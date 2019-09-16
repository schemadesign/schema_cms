import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ArrowRightSVG from '../../../images/icons/arrow-right.svg';
import { containerStyles } from './arrowRightIcon.styles';

export class ArrowRightIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <ArrowRightSVG {...restProps} style={styles} />;
  }
}
