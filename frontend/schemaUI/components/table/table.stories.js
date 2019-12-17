import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../.storybook/decorators';
import { Table } from './table.component';

const longValue = `Sed eu dictum orci. In hac habitasse platea dictumst.
  Donec vestibulum scelerisque est sit amet mattis. Duis ac magna
  elementum felis semper dapibus nec id ligula. Nullam vehicula urna
  ac arcu scelerisque tincidunt. Vestibulum ante ipsum primis in
  faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque
  aliquet, nulla et tincidunt porttitor, eros risus pellentesque lorem,
  in elementum dui magna ac sem. Nulla facilisi. In hac habitasse platea
  dictumst. Sed eu dictum orci. In hac habitasse platea dictumst.
`;
const header = ['Code', 'Capital', 'Country'];
const rows = [
  ['US', 'Washington, D.C.', 'USA'],
  ['PL', 'Warsaw', 'Poland'],
  ['DE', 'Berlin', 'Germany'],
  ['FR', 'Paris', 'France'],
  ['ES', 'Madird', 'Spain'],
  ['—', longValue, longValue],
];
const table = { rows };
const tableWithHeader = { header, rows };

export const tableWithNumberedRows = { header, rows, numberedRows: true };

export const TableWrapper = props => (
  <div style={{ padding: 50 }}>
    <Table {...props} />
  </div>
);

storiesOf('Table', module)
  .addDecorator(withTheme())
  .add('Default', () => <TableWrapper {...table} />)
  .add('with header', () => <TableWrapper {...tableWithHeader} />)
  .add('with numbered rows', () => <TableWrapper {...tableWithNumberedRows} />);
