import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckboxOnSVG from '../../../images/icons/checkbox-on.svg';
import { containerStyles } from './checkboxOnIcon.styles';

export class CheckboxOnIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };

    return <CheckboxOnSVG {...restProps} style={styles} />;
  }
}
