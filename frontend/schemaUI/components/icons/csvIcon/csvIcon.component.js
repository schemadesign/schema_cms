import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CsvSVG from '../../../images/icons/spreadsheet.svg';
import { containerStyles } from './csvIcon.styles';

export class CsvIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...this.props.customStyles };

    return <CsvSVG {...restProps} style={styles} />;
  }
}
