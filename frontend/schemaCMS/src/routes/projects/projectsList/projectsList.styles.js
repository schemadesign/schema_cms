import styled from 'styled-components';

export const Container = styled.div``;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Item = styled.li`
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }
`;

export const HeaderList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const HeaderItem = styled.li`
  display: inline-block;

  &::before {
    content: '•';
    display: inline-block;
    padding: 0 7px;
  }

  &:first-child::before {
    display: none;
  }
`;

export const Empty = styled.div``;
