import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PlusSVG from '../../../images/icons/plus.svg';
import { getStyles } from './plusIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class PlusIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    inverse: PropTypes.bool,
  };

  static defaultProps = {
    inverse: false,
  };

  render() {
    const { customStyles, theme, inverse, ...restProps } = this.props;
    const containerStyles = getStyles(theme, inverse);
    const styles = { ...containerStyles, ...customStyles };

    return <PlusSVG {...restProps} style={styles} />;
  }
}

export const PlusIcon = withStyles(PlusIconComponent);
