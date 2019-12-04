import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './filterIcon.styles';
import FilterSVG from '../../../images/icons/filter.svg';
import { withStyles } from '../../styles/withStyles';

export class FilterIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <FilterSVG {...restProps} style={styles} />;
  }
}

export const FilterIcon = withStyles(FilterIconComponent);
