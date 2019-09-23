import styled from 'styled-components';
import { Theme } from 'schemaUI';

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
`;

export const Table = styled.table`
  border-collapse: collapse;
`;

export const TableHeader = styled.thead``;

export const TableBody = styled.tbody``;

export const Row = styled.tr`
  &:last-of-type td:first-of-type {
    border-bottom-color: ${Theme.primary.background};
    padding-bottom: 10px;
  }
`;

const cellStyles = `
  padding: 12px;
  font-size: 14px;
  padding: 7px 12px;
  border-bottom: 2px solid ${Theme.primary.background};
  border-right: 2px solid ${Theme.primary.background};
`;

const headerCellStyles = `
  background-color: ${Theme.primary.background};
  color: ${Theme.primary.label};
  font-weight: 600;
  padding: 12px;
  border-right-color: ${Theme.secondary.text};
  border-bottom-color: ${Theme.secondary.text};
`;

export const Cell = styled.td`
  ${cellStyles}
`;

export const HeaderCell = styled.th`
  ${cellStyles}
  ${headerCellStyles}
  text-align: left;

  &:first-of-type {
    text-align: center;
  }

  &:last-of-type {
    border-right-color: ${Theme.primary.background};
  }
`;

export const LeftHeaderCell = styled.td`
  ${cellStyles}
  ${headerCellStyles}
  text-align: center;
  min-width: 40px;
`;
