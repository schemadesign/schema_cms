import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './schemaLogoIcon.styles';
import SchemaLogoSVG from '../../../images/icons/schemaLogo.svg';
import { withStyles } from '../../styles/withStyles';

export class SchemaLogoIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <SchemaLogoSVG {...restProps} style={styles} />;
  }
}

export const SchemaLogoIcon = withStyles(SchemaLogoIconComponent);
