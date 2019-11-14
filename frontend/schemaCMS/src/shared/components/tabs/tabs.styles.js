import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from '../../../theme/media';

export const Container = styled.div`
  display: none;

  ${media.desktop`
    display: flex;
    margin: 29px 0 20px 0;
    font-size: 15px;
  `}
`;

export const Tab = styled.div`
  display: block;
  flex: 1;
  padding: 16px;
  align-self: flex-end;
  text-align: center;
  border-bottom: 2px solid ${({ active, theme: { tab } }) => (active ? tab.active : tab.normal)};
  cursor: pointer;

  &:hover {
    border-bottom-color: ${({ theme: { tab } }) => tab.hover};
  }
`;

export const TabContent = styled(Link)`
  color: ${({ theme: { text } }) => text};
  text-decoration: none;
`;
