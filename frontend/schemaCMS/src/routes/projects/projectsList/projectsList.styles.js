import styled from 'styled-components';
import { Theme } from 'schemaUI';

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
  line-height: 1.25;

  &::before {
    content: '•';
    display: inline-block;
    padding: 0 7px;
  }

  &:first-child::before {
    display: none;
  }
`;

export const Description = styled.div`
  margin: 7px 0 14px;
`;

export const Empty = styled.div`
  text-align: center;
  padding: 10px;
`;

export const urlStyles = {
  color: Theme.primary.label,
  fontSize: '12px',
  whiteSpace: 'nowrap',
  display: 'block',
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};
