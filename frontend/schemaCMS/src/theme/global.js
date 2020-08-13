import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.background};
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    font-family: ${({ theme }) => theme.typography.p.fontFamily};
    overflow-x: hidden;
  }

  html, body {
    position: relative;
  }

  html.hideScroll,
  html.hideScroll body {
    overflow: hidden;
    position: relative;
    height: 100%;
  }

  input:-webkit-autofill {
     -webkit-text-fill-color: ${({ theme }) => theme.text};
    box-shadow: 0 0 0 50px ${({ theme }) => theme.border} inset;
  }

  input[placeholder]::-webkit-input-placeholder {
    color: inherit;
    opacity: 0.5;
  }
`;
