import styled, { css } from 'styled-components';

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
`;

export const TableElement = styled.table`
  border-collapse: collapse;
  min-width: 100%;
`;

export const TableHeader = styled.thead``;

export const TableBody = styled.tbody``;

export const Row = styled.tr`
  &:last-of-type td:first-of-type {
    border-bottom-color: ${({ theme: { table } }) => table.border.body};
    padding-bottom: 10px;
  }
`;

const cellStyles = css`
  font-size: 14px;
  padding: 7px 12px;
  border-bottom: 2px solid ${({ theme: { table } }) => table.border.body};
  border-right: 2px solid ${({ theme: { table } }) => table.border.body};
  color: ${({ theme: { table } }) => table.text.body};
`;

const headerCellStyles = css`
  background-color: ${({ theme: { table } }) => table.background.header};
  color: ${({ theme: { table } }) => table.text.header};
  font-weight: 600;
  padding: 12px;
  border-right-color: ${({ theme: { table } }) => table.border.header};
  border-bottom-color: ${({ theme: { table } }) => table.border.header};
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
    border-right-color: ${({ theme: { table } }) => table.border.header};
  }
`;

export const LeftHeaderCell = styled.td`
  ${cellStyles}
  ${headerCellStyles}
  text-align: center;
  min-width: 40px;
`;
