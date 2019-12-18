import React, { Fragment } from 'react';

import { ThemeProvider } from '../components/styles/themeProvider';
import { Theme } from '../utils/theme';
import { prepareFontSet } from './fonts';

export const withTheme = (theme = Theme.dark) => story => (
  <ThemeProvider theme={theme}>
    <div style={{ color: theme.text, backgroundColor: theme.background, padding: 20 }}>{story()}</div>
  </ThemeProvider>
);

export const FontDecorator = storyFn => (
  <Fragment>
    <style>{prepareFontSet()}</style>
    {storyFn()}
  </Fragment>
);
