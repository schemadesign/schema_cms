import styled from 'styled-components';

export const Container = styled.div``;

export const ErrorContainer = styled.div`
  color: ${({ theme: { error } }) => error};
  text-align: center;
  padding: 50px 10px;
  font-weight: 200;
  font-size: 20px;
`;
