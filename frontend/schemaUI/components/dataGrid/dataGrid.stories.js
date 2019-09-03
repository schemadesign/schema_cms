import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataGrid } from './dataGrid.component';
import { BLACK_COLOR, BLUE_COLOR, WHITE_COLOR, GRAY_COLOR } from './dataGrid.styles';

const data = {
  columns: [
    { name: 'id', displayName: '#' },
    { name: 'name', displayName: 'Name' },
    { name: 'surname', displayName: 'Surname' },
    { name: 'dateOfBirth', displayName: 'Date of Birth' },
  ],
  rows: [
    { id: '342', name: 'Alan', surname: 'Watts', dateOfBirth: '06/01/1915' },
    { id: '355', name: 'David', surname: 'Bowie', dateOfBirth: '08/01/1947' },
    { id: '123', name: 'Dale', surname: 'Chihuly', dateOfBirth: '20/09/1941' },
    { id: '556', name: 'Sebastião', surname: 'Salgado', dateOfBirth: '08/02/1944' },
  ],
};

const defaultProps = {
  data,
};

storiesOf('DataGrid', module).add('Default', () => <DataGrid {...defaultProps} />);

const firstColumnStyle = {
  backgroundColor: BLACK_COLOR,
  padding: '10px 5px',
  borderBottom: `1px solid ${GRAY_COLOR}`,
  color: GRAY_COLOR,
};

const columnStyles = {
  backgroundColor: BLACK_COLOR,
  padding: '10px 5px',
  borderBottom: `1px solid ${GRAY_COLOR}`,
  color: GRAY_COLOR,
};

const rowStyles = {
  id: {
    backgroundColor: BLACK_COLOR,
    padding: '10px 5px',
    borderRight: `1px solid ${GRAY_COLOR}`,
    color: GRAY_COLOR,
  },
  name: {
    backgroundColor: BLUE_COLOR,
    padding: '10px 5px',
    color: WHITE_COLOR,
  },
  surname: {
    backgroundColor: BLUE_COLOR,
    padding: '10px 5px',
    color: WHITE_COLOR,
  },
  dateOfBirth: {
    backgroundColor: BLUE_COLOR,
    padding: '10px 5px',
    color: WHITE_COLOR,
  },
};

const dataWithStyles = {
  columns: [
    { name: 'id', displayName: '#', styles: firstColumnStyle },
    { name: 'name', displayName: 'Name', styles: columnStyles },
    { name: 'surname', displayName: 'Surname', styles: columnStyles },
    { name: 'dateOfBirth', displayName: 'Date of Birth', styles: columnStyles },
  ],
  rows: [
    { id: '342', name: 'Alan', surname: 'Watts', dateOfBirth: '06/01/1915', styles: rowStyles },
    { id: '355', name: 'David', surname: 'Bowie', dateOfBirth: '08/01/1947', styles: rowStyles },
    { id: '123', name: 'Dale', surname: 'Chihuly', dateOfBirth: '20/09/1941', styles: rowStyles },
    { id: '556', name: 'Sebastião', surname: 'Salgado', dateOfBirth: '08/02/1944', styles: rowStyles },
  ],
};

const withStylesProps = {
  data: dataWithStyles,
};

storiesOf('DataGrid', module).add('With Styles', () => <DataGrid {...withStylesProps} />);

const columnAlternativeStyles = {
  backgroundColor: BLUE_COLOR,
  border: `0.3px solid ${WHITE_COLOR}`,
  padding: '10px 5px',
  color: WHITE_COLOR,
};

const rowAlternativeStyles = {
  id: {
    backgroundColor: BLUE_COLOR,
    border: `0.3px solid ${WHITE_COLOR}`,
    padding: '10px 5px',
    color: WHITE_COLOR,
  },
  name: {
    backgroundColor: BLACK_COLOR,
    border: `0.3px solid ${WHITE_COLOR}`,
    padding: '10px 5px',
    color: GRAY_COLOR,
  },
  surname: {
    backgroundColor: BLACK_COLOR,
    border: `0.3px solid ${WHITE_COLOR}`,
    padding: '10px 5px',
    color: GRAY_COLOR,
  },
  dateOfBirth: {
    backgroundColor: BLACK_COLOR,
    border: `0.3px solid ${WHITE_COLOR}`,
    padding: '10px 5px',
    color: GRAY_COLOR,
  },
};

const dataWithStylesAndSize = {
  columns: [
    { name: 'id', displayName: '# - Sized', styles: columnAlternativeStyles, size: 10 },
    { name: 'name', displayName: 'Name', styles: columnAlternativeStyles },
    { name: 'surname', displayName: 'Surname', styles: columnAlternativeStyles },
    { name: 'dateOfBirth', displayName: 'Date of Birth', styles: columnAlternativeStyles },
  ],
  rows: [
    { id: '342', name: 'Alan', surname: 'Watts', dateOfBirth: '06/01/1915', styles: rowAlternativeStyles },
    { id: '355', name: 'David', surname: 'Bowie', dateOfBirth: '08/01/1947', styles: rowAlternativeStyles },
    { id: '123', name: 'Dale', surname: 'Chihuly', dateOfBirth: '20/09/1941', styles: rowAlternativeStyles },
    { id: '556', name: 'Sebastião', surname: 'Salgado', dateOfBirth: '08/02/1944', styles: rowAlternativeStyles },
  ],
};

const withStylesAndSizeProps = {
  data: dataWithStylesAndSize,
};

storiesOf('DataGrid', module).add('With Styles and size', () => <DataGrid {...withStylesAndSizeProps} />);
