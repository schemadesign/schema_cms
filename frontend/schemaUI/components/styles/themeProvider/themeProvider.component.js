import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ThemeContext } from '../themeContext';
import { primary } from '../../../utils/theme';

export class ThemeProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    theme: PropTypes.object,
  };

  static defaultProps = {
    theme: primary,
  };

  render() {
    return <ThemeContext.Provider value={{ theme: this.props.theme }}>{this.props.children}</ThemeContext.Provider>;
  }
}
