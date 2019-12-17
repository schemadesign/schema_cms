import styled from 'styled-components';

export const InfoContainer = styled.div`
  color: ${({ theme: { text } }) => text};
  text-align: center;
  padding: 50px 10px;
  font-weight: 200;
  font-size: 20px;
  line-height: 1.5em;
`;
