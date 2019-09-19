import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PlusSVG from '../../../images/icons/plus.svg';
import { containerStyles } from './plusIcon.styles';

export class PlusIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <PlusSVG {...restProps} style={styles} />;
  }
}
