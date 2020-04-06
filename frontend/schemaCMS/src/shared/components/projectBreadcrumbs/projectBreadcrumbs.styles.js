import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const Container = styled.div``;

export const Link = styled(RouterLink)`
  color: ${({ theme, active }) => (active ? theme.link.hover : theme.link.text)};
  text-decoration: none;
  width: 100%;
  &:hover {
    color: ${({ theme }) => theme.link.hover};
  }
`;
