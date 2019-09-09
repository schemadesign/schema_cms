import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TableWrapper,
  Table,
  TableHeader,
  TableBody,
  Row,
  Cell,
  HeaderCell,
  LeftHeaderCell,
} from './previewTable.styles';

export class PreviewTable extends PureComponent {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
  };

  prepareData() {
    const columnsIds = Object.keys(this.props.fields);
    const rowsData = [];

    this.props.data.forEach((data, index) => {
      const row = [];

      columnsIds.forEach(name => {
        row.push(data[name] || '');
      });

      rowsData.push(row);
    });

    return {
      columns: ['#', ...columnsIds],
      rowsData,
    };
  }

  renderHeaderCells(data = []) {
    const cells = data.map((value, index) => <HeaderCell key={index}>{value}</HeaderCell>);

    return <Row>{cells}</Row>;
  }

  renderCells = (data = []) => data.map((value, index) => <Cell key={index}>{value}</Cell>);

  renderBodyRows = (data = []) =>
    data.map((cells, index) => (
      <Row key={index}>
        <LeftHeaderCell>{index + 1}</LeftHeaderCell>
        {this.renderCells(cells)}
      </Row>
    ));

  render() {
    const { columns, rowsData } = this.prepareData();
    const header = this.renderHeaderCells(columns);
    const rows = this.renderBodyRows(rowsData);

    return (
      <TableWrapper>
        <Table>
          <TableHeader>{header}</TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableWrapper>
    );
  }
}
