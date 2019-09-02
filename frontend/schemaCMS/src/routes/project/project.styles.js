import styled from 'styled-components';

export const Empty = styled.div`
  text-align: center;
  padding: 10px;
`;

export const Loader = styled.div`
  text-align: center;
  padding: 50px 10px;
  font-weight: 200;
  font-size: 20px;

  &:after {
    content: 'Loading...';
  }
`;

export const headerStyles = {
  backgroundColor: null,
};
