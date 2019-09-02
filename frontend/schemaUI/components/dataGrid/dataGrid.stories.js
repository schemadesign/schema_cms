import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataGrid } from './dataGrid.component';

const data = {
  columns: [
    { name: 'id', displayName: '#' },
    { name: 'name', displayName: 'Name' },
    { name: 'surname', displayName: 'Surname' },
    { name: 'dateOfBirth', displayName: 'Date of Birth' },
  ],
  rows: [
    { id: '342', column1: 'Alan', surname: 'Watts', dateOfBirth: '06/01/1915' },
    { id: '355', column1: 'David', surname: 'Bowie', dateOfBirth: '08/01/1947' },
    { id: '123', column1: 'Dale', surname: 'Chihuly', dateOfBirth: '20/09/1941' },
    { id: '556', column1: 'Sebastião', surname: 'Salgado', dateOfBirth: '08/02/1944' },
  ],
};

const defaultProps = {
  data,
};

storiesOf('DataGrid', module).add('Default', () => <DataGrid {...defaultProps} />);
