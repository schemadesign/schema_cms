import React, { Fragment } from 'react';

import { fontFormats, interFontFaces } from './fonts';

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
