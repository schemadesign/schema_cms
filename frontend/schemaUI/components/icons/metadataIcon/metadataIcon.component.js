import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MetadataSVG from '../../../images/icons/metadata.svg';
import { getStyles } from './metadataIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class MetadataIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <MetadataSVG {...restProps} style={styles} />;
  }
}

export const MetadataIcon = withStyles(MetadataIconComponent);
