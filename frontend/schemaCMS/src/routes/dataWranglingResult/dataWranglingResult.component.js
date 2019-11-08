import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, path, pipe, find, propEq } from 'ramda';

import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { Loader } from '../../shared/components/loader';
import { Table } from '../../shared/components/table';
import messages from './dataWranglingResult.messages';
import { Container } from './dataWranglingResult.styles';
import { StepNavigation } from '../../shared/components/stepNavigation';
import { getTableData } from '../../shared/utils/helpers';
import { JOB_STATE_SUCCESS } from '../../modules/job/job.constants';
import { DATA_WRANGLING_STEP } from '../../modules/dataSource/dataSource.constants';

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

  state = {
    loading: true,
  };

  async componentDidMount() {
    const jobId = pipe(
      path(['dataSource', 'jobs']),
      find(propEq('jobState', JOB_STATE_SUCCESS)),
      path(['id'])
    )(this.props);

    const dataSourceId = path(['match', 'params', 'dataSourceId'], this.props);

    if (!jobId) {
      this.props.history.push(`/datasource/${dataSourceId}/${DATA_WRANGLING_STEP}`);
    }

    await this.props.fetchResult({ dataSourceId });
    this.setState({ loading: false });
  }

  renderTable = props => <Table {...props} numberedRows />;

  renderContent = renderWhenTrueOtherwise(always(<Loader />), () => {
    const data = path(['previewData', 'data'], this.props);
    const tableData = getTableData(data);

    return this.renderTable(tableData);
  });

  render() {
    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        {this.renderContent(this.state.loading)}
        <StepNavigation {...this.props} />
      </Container>
    );
  }
}
