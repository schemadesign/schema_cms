import React from 'react';

import { ThemeContext } from '../themeContext';

export const withStyles = Component => props => (
  <ThemeContext.Consumer>{({ theme }) => <Component theme={theme} {...props} />}</ThemeContext.Consumer>
);
