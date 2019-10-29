import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, path } from 'ramda';

import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { Loader } from '../../shared/components/loader';
import { Table } from '../../shared/components/table';
import messages from './dataWranglingResult.messages';
import { Container } from './dataWranglingResult.styles';
import { StepNavigation } from '../../shared/components/stepNavigation';
import { getTableData } from '../../shared/utils/helpers';

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
    const jobId = path(['dataSource', 'jobs', 0, 'id'], this.props);
    await this.props.fetchResult({ jobId });
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
