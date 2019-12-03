import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './fieldIcon.styles';
import FieldSVG from '../../../images/icons/field.svg';
import { withStyles } from '../../styles/withStyles';

export class FieldIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <FieldSVG {...restProps} style={styles} />;
  }
}

export const FieldIcon = withStyles(FieldIconComponent);
