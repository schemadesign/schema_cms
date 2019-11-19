import styled from 'styled-components';

export const Container = styled.div`
  color: ${({ theme: { text } }) => text};
  text-align: center;
  padding: 50px 10px;
  font-weight: 200;
  font-size: 20px;
`;
