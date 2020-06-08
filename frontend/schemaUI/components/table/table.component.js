import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '../styles/withStyles';
import { getStyles, headerBaseWidth, headerNarrowWidth } from './table.styles';
import { isIOS } from '../../utils/is';

const NUMBERED_COLUMN_NAME = '#';
const ROWS_LIMIT = 10;

class TableComponent extends PureComponent {
  static propTypes = {
    header: PropTypes.array,
    rows: PropTypes.array.isRequired,
    numberedRows: PropTypes.bool,
  };

  static defaultProps = {
    numberedRows: false,
    header: [],
  };

  getLastIndex = (data = []) => data.length - 1;

  getHeaderCellStyle = (index, lastIndex, numberedRows, countRows, { headerCell, headerFirstCell, headerLastCell }) => {
    if (!index && numberedRows) {
      return {
        ...headerFirstCell,
        width: countRows < ROWS_LIMIT ? headerNarrowWidth : headerBaseWidth,
      };
    }

    if (index === lastIndex) {
      return headerLastCell;
    }

    return headerCell;
  };

  renderHeaderCells(styles) {
    const { header, numberedRows, rows } = this.props;
    const data = numberedRows ? [NUMBERED_COLUMN_NAME, ...header] : header;
    const lastIndex = this.getLastIndex(data);
    const countRows = rows.length;

    return data.map((value, index) => (
      <th style={this.getHeaderCellStyle(index, lastIndex, numberedRows, countRows, styles)} key={index}>
        {`${value}`}
      </th>
    ));
  }

  renderHeader = styles => (
    <thead style={styles.thead}>
      <tr>{this.renderHeaderCells(styles)}</tr>
    </thead>
  );

  renderNumberedCell = (index, lastIndex, numberedRows, { headerLeftCell, headerLastLeftCell }) => {
    if (!numberedRows) {
      return null;
    }

    const styles = index === lastIndex ? headerLastLeftCell : headerLeftCell;

    return <td style={styles}>{index + 1}</td>;
  };

  renderCells = (data, cellStyles) =>
    data.map((value, index) => (
      <td style={cellStyles} key={index}>
        {`${value}`}
      </td>
    ));

  renderRows = styles => {
    const { rows, numberedRows } = this.props;
    const lastIndex = this.getLastIndex(rows);
    const cellStyles = numberedRows ? styles.cell : styles.cellCustom;

    return rows.map((cells, index) => (
      <tr key={index}>
        {this.renderNumberedCell(index, lastIndex, numberedRows, styles)}
        {this.renderCells(cells, cellStyles)}
      </tr>
    ));
  };

  renderTable = styles => {
    const header = this.props.header.length ? this.renderHeader(styles) : null;
    return (
      <table style={styles.table}>
        {header}
        <tbody>{this.renderRows(styles)}</tbody>
      </table>
    );
  };

  render() {
    const { theme } = this.props;
    const styles = getStyles(theme);
    const wrapperStyles = isIOS() ? { ...styles.table, ...styles.iOSStyles } : styles.tableWrapper;

    return <div style={wrapperStyles}>{this.renderTable(styles)}</div>;
  }
}

export const Table = withStyles(TableComponent);
