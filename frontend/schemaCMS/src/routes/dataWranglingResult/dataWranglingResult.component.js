import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, isNil, keys, map } from 'ramda';

import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { Loader } from '../../shared/components/loader';
import { Table } from '../../shared/components/table';
import messages from './dataWranglingResult.messages';
import { Container } from './dataWranglingResult.styles';
import { StepNavigation } from '../../shared/components/stepNavigation';

export class DataWranglingResult extends PureComponent {
  static propTypes = {
    previewData: PropTypes.object.isRequired,
    dataSource: PropTypes.object,
    fetchResult: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  componentDidMount() {
    this.props.fetchResult({ jobId: this.props.dataSource.jobs[0].id });
  }

  getTableData() {
    const columnsIds = keys(this.props.previewData.fields);
    const rows = map(data => map(name => data[name], columnsIds), this.props.previewData.data);

    return { header: columnsIds, rows };
  }

  renderTable = props => <Table {...props} numberedRows />;

  renderContent = renderWhenTrueOtherwise(always(<Loader />), () => {
    const tableData = this.getTableData();

    return this.renderTable(tableData);
  });

  render() {
    const isLoading = isNil(this.props.previewData.data);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        {this.renderContent(isLoading)}
        <StepNavigation {...this.props} />
      </Container>
    );
  }
}
