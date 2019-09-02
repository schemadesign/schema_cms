import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataGrid } from './dataGrid.component';
import { HEADER_COLOR, TEXT_COLOR } from './dataGrid.styles';

const BLACK_COLOR = '#000';

const firstColumnStyle = {
  backgroundColor: HEADER_COLOR,
  color: TEXT_COLOR,
};

const columnStyles = {
  backgroundColor: HEADER_COLOR,
  color: TEXT_COLOR,
};

const rowStyles = {
  id: {
    styles: {
      backgroundColor: HEADER_COLOR,
      color: TEXT_COLOR,
    },
  },
  name: {
    backgroundColor: BLACK_COLOR,
    color: TEXT_COLOR,
  },
  surname: {
    backgroundColor: BLACK_COLOR,
    color: TEXT_COLOR,
  },
  dateOfBirth: {
    backgroundColor: BLACK_COLOR,
    color: TEXT_COLOR,
  },
};

const data = {
  columns: [
    { name: 'id', displayName: '#', styles: firstColumnStyle, size: 10 },
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

const defaultProps = {
  data,
};

storiesOf('DataGrid', module).add('Default', () => <DataGrid {...defaultProps} />);
