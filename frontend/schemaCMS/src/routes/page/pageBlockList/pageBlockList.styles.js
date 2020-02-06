import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const Container = styled.div``;

export const CreateButtonContainer = styled.div`
  width: 20%;
`;

export const BlockCounter = styled.div`
  width: 60%;
  text-align: center;
  color: ${({ theme: { secondaryText } }) => secondaryText};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export const Empty = styled.div`
  width: 20%;
`;

export const Link = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const checkboxStyles = {
  width: '100%',
};

export const CheckboxContent = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  cursor: move;
  touch-action: none;
`;

export const menuIconStyles = { width: 10, marginRight: 20 };
