import styled from 'styled-components';

export const Container = styled.div`
  position: ${({ isAuthWidth }) => (isAuthWidth ? 'relative' : 'static')};
  max-width: 100%;
`;

export const IconWrapper = styled.div`
  padding-top: ${({ isLabel }) => (isLabel ? '7px' : 0)};
  margin-top: ${({ isLabel }) => (isLabel ? 0 : '-2px')};
`;

export const ErrorWrapper = styled.div`
  position: absolute;
  top: ${({ isLabel }) => (isLabel ? '50px' : '30px')};
  left: 0;
  color: ${({ theme: { textField } }) => textField.error};
  font-size: 14px;
  font-weight: normal;
`;
