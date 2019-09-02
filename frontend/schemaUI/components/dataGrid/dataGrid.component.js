import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, columnStyles, rowStyles } from './dataGrid.styles';

export class DataGrid extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  renderColumns = (column, index) => (
    <div key={index} style={columnStyles.columnItem}>
      {column.displayName}
    </div>
  );

  renderRows = (row, index) => (
    <div key={index} style={rowStyles.rowItem}>
      {this.props.data.columns.map(({ name }, index) => (
        <div key={index}>{row[name]}</div>
      ))}
    </div>
  );

  render() {
    const {
      data: { columns, rows },
    } = this.props;
    return (
      <div style={containerStyles}>
        <div style={columnStyles.columnHeader}>{columns.map(this.renderColumns)}</div>
        <div style={rowStyles.rowHeader}>{rows.map(this.renderRows)}</div>
      </div>
    );
  }
}
