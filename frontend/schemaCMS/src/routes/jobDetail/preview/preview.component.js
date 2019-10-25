import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always, keys, map, path } from 'ramda';

import { Container } from './preview.styles';
import { Table } from '../../../shared/components/table';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { Loader } from '../../../shared/components/loader';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './preview.messages';
import { BackButton, NavigationContainer } from '../../../shared/components/navigation';
import browserHistory from '../../../shared/utils/history';

export class Preview extends PureComponent {
  static propTypes = {
    fetchPreview: PropTypes.func.isRequired,
    previewData: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const jobId = path(['match', 'params', 'jobId'], this.props);
    this.props.fetchPreview({ jobId });
  }

  getTableData() {
    const columnsIds = keys(this.props.previewData.fields);
    const rows = map(data => map(name => data[name], columnsIds), this.props.previewData.data);

    return { header: columnsIds, rows };
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleBackClick = () => browserHistory.push(`/job/${path(['match', 'params', 'jobId'], this.props)}`);

  renderTable = props => <Table {...props} numberedRows />;

  renderContent = renderWhenTrueOtherwise(always(<Loader />), () => {
    const tableData = this.getTableData();

    return this.renderTable(tableData);
  });

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        {this.renderContent(!this.props.previewData.data)}
        <NavigationContainer>
          <BackButton onClick={this.handleBackClick} />
        </NavigationContainer>
      </Container>
    );
  }
}
