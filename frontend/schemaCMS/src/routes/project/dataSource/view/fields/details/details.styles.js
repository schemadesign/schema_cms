import styled from 'styled-components';
import { Theme, Icons } from 'schemaUI';

export const Container = styled.div``;

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const FieldInformation = styled.li`
  border-bottom: 2px solid ${Theme.dark.background};
  padding: 12px 0;
  display: flex;
  width: 100%;

  &:first-of-type {
    border-top: 2px solid ${Theme.dark.background};
  }
`;

export const FieldSummary = styled(FieldInformation)`
  display: inline-block;
  width: calc(50% - 10px);
`;

export const Label = styled.span`
  color: ${Theme.colors.lightGrey};
  display: inline-block;
  margin-right: 10px;
  flex: 0 0 auto;
`;

export const Value = styled.span`
  color: ${Theme.colors.white};
  flex: 1 1 auto;
`;

export const EditIcon = styled(Icons.EditIcon)`
  margin: -5px 0 -7px 0;
  flex: 0 0 auto;
  cursor: pointer;
`;
