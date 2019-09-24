import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import EditSVG from '../../../images/icons/edit.svg';
import { getStyles } from './editIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class EditIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <EditSVG {...restProps} style={styles} />;
  }
}

export const EditIcon = withStyles(EditIconComponent);
