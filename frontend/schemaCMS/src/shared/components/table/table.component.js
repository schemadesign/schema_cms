import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always } from 'ramda';

import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';
import {
  TableWrapper,
  TableElement,
  TableHeader,
  TableBody,
  Row,
  Cell,
  HeaderCell,
  LeftHeaderCell,
} from './table.styles';
import { NoData } from '../noData';

const NUMBERED_COLUMN_NAME = '#';

export class Table extends PureComponent {
  static propTypes = {
    header: PropTypes.array,
    rows: PropTypes.array.isRequired,
    numberedRows: PropTypes.bool,
  };

  static defaultProps = {
    numberedRows: false,
    header: [],
  };

  renderHeaderCells() {
    const { header, numberedRows } = this.props;
    const data = numberedRows ? [NUMBERED_COLUMN_NAME, ...header] : header;

    return data.map((value, index) => <HeaderCell key={index}>{value}</HeaderCell>);
  }

  renderHeader = renderWhenTrue(() => (
    <TableHeader>
      <Row>{this.renderHeaderCells()}</Row>
    </TableHeader>
  ));

  renderCells = (data = []) => data.map((value, index) => <Cell key={index}>{value}</Cell>);

  renderNumberedCell = renderWhenTrue((_, index) => <LeftHeaderCell>{index + 1}</LeftHeaderCell>);

  renderRows = () => {
    const { rows, numberedRows } = this.props;

    return rows.map((cells, index) => (
      <Row key={index}>
        {this.renderNumberedCell(numberedRows, index)}
        {this.renderCells(cells)}
      </Row>
    ));
  };

  renderTableContent = renderWhenTrueOtherwise(
    () => (
      <TableElement>
        {this.renderHeader(!!this.props.header.length)}
        <TableBody>{this.renderRows()}</TableBody>
      </TableElement>
    ),
    always(<NoData />)
  );

  render() {
    return <TableWrapper>{this.renderTableContent(!!this.props.rows.length)}</TableWrapper>;
  }
}
