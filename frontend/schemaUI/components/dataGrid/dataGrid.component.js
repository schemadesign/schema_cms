import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './dataGrid.styles';
import { Grid } from '../grid';
import { withStyles } from '../styles/withStyles';

const SCREEN_WIDTH_PERCENT = 100;

class DataGridComponent extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  cellWidths = [];

  filterSizedItems = item => item.size;

  reduceSizeSum = (total, currentColumn) => total + (currentColumn.size || 0);

  getCellWidth = size => {
    const sumSize = this.props.data.columns.reduce(this.reduceSizeSum, 0);
    const sizedItemsCount = this.props.data.columns.filter(this.filterSizedItems).length;

    return size ? size : (SCREEN_WIDTH_PERCENT - sumSize) / (this.props.data.columns.length - sizedItemsCount);
  };

  calculateCellWidth = ({ name, size }) => {
    this.cellWidths[name] = this.getCellWidth(size);
  };

  getCustomStyles = (styles, defaultStyle = {}) => styles || defaultStyle;

  renderColumns = (column, index) => {
    const { columnStyles } = getStyles(this.props.theme);
    return (
      <Grid
        key={index}
        size={this.cellWidths[column.name]}
        customStyles={this.getCustomStyles(column.styles, columnStyles.columnItem)}
      >
        {column.displayName}
      </Grid>
    );
  };

  renderRows = (row, index) => (
    <Grid key={index} size={100}>
      {this.props.data.columns.map(({ name }, index) => {
        const styles = row.styles ? row.styles[name] : {};

        return (
          <Grid key={index} size={this.cellWidths[name]} customStyles={this.getCustomStyles(styles)}>
            {row[name]}
          </Grid>
        );
      })}
    </Grid>
  );

  render() {
    const {
      theme,
      data: { columns, rows },
    } = this.props;

    const { containerStyles, columnStyles, rowStyles } = getStyles(theme);
    columns.forEach(this.calculateCellWidth);

    return (
      <div style={containerStyles}>
        <div style={columnStyles.columnHeader}>{columns.map(this.renderColumns)}</div>
        <div style={rowStyles.rowHeader}>{rows.map(this.renderRows)}</div>
      </div>
    );
  }
}

export const DataGrid = withStyles(DataGridComponent);
