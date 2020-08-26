import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './googleSpreadsheetIcon.styles';
import GoogleSpreadsheetSVG from '../../../images/icons/googleIcon.svg';
import { withStyles } from '../../styles/withStyles';

export class GoogleSpreadsheetIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <GoogleSpreadsheetSVG {...restProps} style={styles} />;
  }
}

export const GoogleSpreadsheetIcon = withStyles(GoogleSpreadsheetIconComponent);
