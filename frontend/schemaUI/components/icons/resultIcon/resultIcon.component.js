import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './resultIcon.styles';
import ResultSVG from '../../../images/icons/result.svg';
import { withStyles } from '../../styles/withStyles';

export class ResultIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <ResultSVG {...restProps} style={styles} />;
  }
}

export const ResultIcon = withStyles(ResultIconComponent);
