import styled from 'styled-components';
import { Typography } from 'schemaUI';

import { media } from '../../../theme/media';

export const Container = styled.div`
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

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const PrimaryList = styled(List)`
  margin-bottom: 30px;
`;

export const SecondaryList = styled(List)`
  align-items: flex-start;
`;

export const Item = styled.li`
  line-height: 1.5;
  margin: 2px 0;
  cursor: pointer;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    display: block;
  }
`;

export const PrimaryItem = styled(Item)`
  font-size: 24px;
  border-bottom: 2.4px solid ${({ theme, active }) => (active ? theme.header.text : theme.header.border)};
  padding: 8px 0 13px;
  display: ${({ hide }) => (hide ? 'none' : 'block')};

  &:first-of-type {
    border-top: 2.4px solid ${({ theme }) => theme.header.border};
  }

  ${media.desktop`
    padding: 22px 0 27px;
    font-size: 20px;
  `};
`;

export const SecondaryItem = styled(Item)`
  padding: 0;
  margin: 10px 0;
  transition: border 400ms;
  border-bottom: 1px solid transparent;
  display: inline-block;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.text};
  }
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
};

export const closeButtonStyles = {
  backgroundColor: 'transparent',
};
