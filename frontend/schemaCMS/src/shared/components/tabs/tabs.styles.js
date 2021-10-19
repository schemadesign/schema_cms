import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from '../../../theme/media';

export const Container = styled.div`
  display: ${({ hideOnMobile }) => (hideOnMobile ? 'none' : 'flex')};

  ${media.desktop`
    display: flex;
    margin: 29px 0 20px 0;
    font-size: 14px;
  `};
  border-bottom: 1px solid grey;
`;

export const InnerContainer = styled.div`
  display: flex;
  width: 100%;

  ${media.desktop`
    width: ${({ hideOnMobile }) => (hideOnMobile ? 'auto' : '400px')};
  `};
`;

export const Tab = styled.div`
  display: block;
  flex: 1;
  align-self: flex-end;
  text-align: center;
  border-bottom: 2px solid ${({ active, theme: { tab } }) => (active ? tab.active : tab.normal)};
  cursor: pointer;

  &:hover {
    border-bottom-color: ${({ theme: { tab } }) => tab.hover};
  }
`;

export const TabContentLink = styled(Link)`
  color: ${({ theme: { text } }) => text};
  display: block;
  padding: 16px;
  text-decoration: none;
`;

export const TabContentButton = styled.div`
  color: ${({ theme: { text } }) => text};
  padding: 16px;
`;
