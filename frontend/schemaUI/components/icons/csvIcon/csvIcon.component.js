import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CsvSVG from '../../../images/icons/spreadsheet.svg';
import { getStyles } from './csvIcon.styles';
import { withStyles } from '../../styles/withStyles';

class CsvIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <CsvSVG {...restProps} style={styles} />;
  }
}

export const CsvIcon = withStyles(CsvIconComponent);
