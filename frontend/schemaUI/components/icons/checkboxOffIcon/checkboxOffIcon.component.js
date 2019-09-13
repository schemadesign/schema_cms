import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckboxOffSVG from '../../../images/icons/checkbox-off.svg';
import { containerStyles } from './checkboxOffIcon.styles';

export class CheckboxOffIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <CheckboxOffSVG {...restProps} style={styles} />;
  }
}
