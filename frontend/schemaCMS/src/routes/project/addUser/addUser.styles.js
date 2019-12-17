import styled from 'styled-components';
import { Button as ButtonUI } from 'schemaUI';

import { media } from '../../../theme/media';

export const Container = styled.div`
  ${media.desktop`
    margin-top: 70px;
  `};
`;

export const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  padding: 10px 0;
  color: ${({ theme }) => theme.secondaryText};
  border-top: 2px solid ${({ theme }) => theme.border};
`;

export const UserItemDescription = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1 1 auto;
`;

export const Action = styled.div`
  display: flex;
  flex: 0 0 auto;
  margin-left: 10px;
  align-items: center;
`;

export const Button = styled(ButtonUI)`
  background-color: transparent !important;
`;

export const UserFullName = styled.div`
  font-size: 20px;
`;

export const Email = styled.div`
  font-size: ${({ theme }) => theme.typography.span.fontSize};
  word-break: break-all;
  margin-top: 5px;
`;

export const iconStyles = {
  width: 42,
  height: 42,
};

export const buttonStyles = {
  width: 42,
  height: 42,
  minHeight: 42,
};
