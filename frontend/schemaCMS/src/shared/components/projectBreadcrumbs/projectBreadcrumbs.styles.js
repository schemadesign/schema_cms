import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const ActiveItem = styled.div`
  color: ${({ theme }) => theme.link.hover};
  width: 100%;
`;

export const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.link.text};
  text-decoration: none;
  width: 100%;
  &:hover {
    color: ${({ theme }) => theme.link.hover};
  }
`;
