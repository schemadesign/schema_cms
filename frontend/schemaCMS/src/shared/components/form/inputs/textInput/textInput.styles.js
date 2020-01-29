import styled from 'styled-components';

export const Container = styled.div``;

export const IconWrapper = styled.div`
  padding-top: ${({ isLabel }) => (isLabel ? '7px' : 0)};
  margin-top: ${({ isLabel }) => (isLabel ? 0 : '-2px')};
`;

export const ErrorWrapper = styled.div`
  display: flex;
  color: ${({ theme: { textField } }) => textField.error};
  margin: -20px 0 20px 0;
  font-size: 0.9em;
`;
