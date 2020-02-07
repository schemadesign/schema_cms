import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TagSVG from '../../../images/icons/tag.svg';
import { getStyles } from './tagIcon.styles';
import { withStyles } from '../../styles/withStyles';

export class TagIconComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  render() {
    const { customStyles, theme, ...restProps } = this.props;
    const containerStyles = getStyles(theme);
    const styles = { ...containerStyles, ...customStyles };

    return <TagSVG {...restProps} style={styles} />;
  }
}

export const TagIcon = withStyles(TagIconComponent);
