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
    padding: 18px 20px 24px 20px;
  }
`;
