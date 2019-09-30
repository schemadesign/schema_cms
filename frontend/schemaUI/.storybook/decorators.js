import React, { Fragment } from 'react';

import { ThemeProvider } from '../components/styles/themeProvider';
import { Theme } from '../utils/theme';
import { fontFormats, interFontFaces } from './fonts';


export const withTheme = (theme = Theme.dark) => (story) => (
  <ThemeProvider theme={theme}>{story()}</ThemeProvider>
);

const prepareFontFace = ({ style, weight, files }) => {
  const srcs = fontFormats.map((format, index) => `url(${files[index]}) format('${format}')`);

  return `
    @font-face {
      font-family: 'Inter';
      font-style: ${style};
      font-weight: ${weight};
      src: ${srcs.join(',\n')};
    }
  `;
};

const prepareFontSet = () => `${interFontFaces.map(prepareFontFace).join('\n')}`;

export const FontDecorator = storyFn => (
  <Fragment>
    <style>{prepareFontSet()}</style>
    {storyFn()}
  </Fragment>
);
