import styled from 'styled-components';

export const Empty = styled.div`
  color: ${({ theme: { text } }) => text};
  text-align: center;
  padding: 10px;
`;
