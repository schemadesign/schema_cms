import styled from 'styled-components';
import { Theme, Icons } from 'schemaUI';

const SHORT_ITEM_MARGIN = '10px';

const setMargin = (index, value = SHORT_ITEM_MARGIN) => {
  const side = index % 2 ? 'left' : 'right';

  return `margin-${side}: ${value};`;
};

export const Container = styled.div``;

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  font-weight: 600;
`;

export const FieldInformation = styled.li`
  border-bottom: 2px solid ${Theme.primary.background};
  padding: 12px 0;
  display: flex;

  &:first-of-type {
    border-top: 2px solid ${Theme.primary.background};
  }
`;

export const FieldSummary = styled(FieldInformation)`
  width: calc(50% - ${SHORT_ITEM_MARGIN});
  display: inline-block;
  ${props => setMargin(props.index)}
`;

export const Label = styled.span`
  color: ${Theme.primary.label};
  display: inline-block;
  margin-right: 10px;
  flex: 0 0 auto;
`;

export const Value = styled.span`
  flex: 1 1 auto;
`;

export const EditIcon = styled(Icons.EditIcon)`
  margin: -5px 0 -7px 0;
  flex: 0 0 auto;
  cursor: pointer;
`;
