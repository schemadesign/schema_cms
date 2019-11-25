import styled from 'styled-components';
import { Button } from 'schemaUI';
import { Link as RouterLink } from 'react-router-dom';

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export const FilterCounter = styled.div`
  width: 34%;
  text-align: center;
  color: ${({ theme: { secondaryText } }) => secondaryText};
`;

export const PlusButton = styled(Button)`
  height: 60px;
`;

export const ButtonContainer = styled.div`
  width: 33%;
`;

export const Link = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
`;
