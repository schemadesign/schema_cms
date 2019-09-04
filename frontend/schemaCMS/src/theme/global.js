import { createGlobalStyle } from 'styled-components';
import { Theme } from 'schemaUI';

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    font-family: ${Theme.primary.typography.p.fontFamily};
  }
`;
