import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { Table } from './table.component';

const header = ['Code', 'Capital', 'Country'];
const rows = [
  ['US', 'Washington, D.C.', 'USA'],
  ['PL', 'Warsaw', 'Poland'],
  ['DE', 'Berlin', 'Germany'],
  ['FR', 'Paris', 'France'],
  ['ES', 'Madird', 'Spain'],
];
const table = { rows };
const tableWithHeader = { header, rows };

export const tableWithNumberedRows = { header, rows, numberedRows: true };

storiesOf('Shared Components/Table', module)
  .addDecorator(withTheme())
  .add('Default', () => <Table {...table} />)
  .add('with header', () => <Table {...tableWithHeader} />)
  .add('with numbered rows', () => <Table {...tableWithNumberedRows} />);
