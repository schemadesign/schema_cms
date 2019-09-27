import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, isNil, keys, map } from 'ramda';

import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { Loader } from '../../shared/components/loader';
import { Table } from '../../shared/components/table';
import messages from './dataWranglingResult.messages';
import { Container } from './dataWranglingResult.styles';

export class DataWranglingResult extends PureComponent {
  static propTypes = {
    fields: PropTypes.object,
    previewTable: PropTypes.array,
    fetchResult: PropTypes.func.isRequired,
    unmountResult: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchResult(this.props.match.params);
  }

  componentWillUnmount() {
    return this.props.unmountResult();
  }

  getTableData() {
    const columnsIds = keys(this.props.fields);
    const rows = map(data => map(name => data[name] || '', columnsIds), this.props.previewTable);

    return { header: columnsIds, rows };
  }

  renderTable = props => <Table {...props} numberedRows />;

  renderContent = renderWhenTrueOtherwise(always(<Loader />), () => {
    const tableData = this.getTableData();

    return this.renderTable(tableData);
  });

  render() {
    const isLoading = isNil(this.props.fields);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        {this.renderContent(isLoading)}
      </Container>
    );
  }
}
