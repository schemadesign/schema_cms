import styled, { css } from 'styled-components';
import { Typography } from 'schemaUI';
import { Link } from 'react-router-dom';
import { ifElse, equals } from 'ramda';

import { media } from '../../../../theme/media';

const getItemTextColor = ({ active, theme }) =>
  ifElse(
    equals(true),
    () => css`
      color: ${theme.text};
    `,
    () => css`
      color: ${theme.secondaryText};
    `
  )(active);

export const Container = styled.div`
  font-weight: normal;
  width: calc(100% - 50px);

  ${media.desktop`
    display: none;
  `};
`;

export const HeaderWrapper = styled.div``;

export const MenuHeader = styled.div``;

export const Content = styled.div`
  overflow: auto;
  max-height: calc(100vh - 70px);
  padding: 40px 0;
  -webkit-overflow-scrolling: touch;

  ${media.desktop`
    padding-bottom: 20px;
    max-height: calc(100vh - 154px);
  `};
`;

export const List = styled.div`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  line-height: 1.5;
  margin: 2px 0;
  cursor: pointer;
  font-size: 24px;
  border-bottom: 2.4px solid ${({ theme, active }) => (active ? theme.header.text : theme.header.border)};
  padding: 8px 0 13px;

  a,
  div {
    text-decoration: none;
    ${getItemTextColor};
    display: block;
  }
`;

export const HelperList = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
`;

export const HelperLink = styled(Link)`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  text-decoration: none;
  margin: 12px 0;
`;

export const Title = styled(Typography.H2)`
  word-break: break-word;
`;

export const Subtitle = styled(Typography.H1)`
  word-break: break-word;
`;

export const menuStyles = {
  zIndex: 9999,
  maxWidth: null,
  position: 'absolute',
};

export const closeButtonStyles = {
  backgroundColor: 'transparent',
};

export const customButtonStyles = {
  right: -6,
};

export const Divider = styled.div``;
