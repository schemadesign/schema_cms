import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './viewIcon.styles';
import ViewSVG from '../../../images/icons/view.svg';
import { withStyles } from '../../styles/withStyles';

export class ViewIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <ViewSVG {...restProps} style={styles} />;
  }
}

export const ViewIcon = withStyles(ViewIconComponent);
