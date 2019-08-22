import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import EditSVG from '../../../images/icons/edit.svg';
import { containerStyles } from './editIcon.styles';

export class EditIcon extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, ...restProps } = this.props;
    const styles = { ...containerStyles, ...this.props.customStyles };

    return <EditSVG {...restProps} style={styles} />;
  }
}
