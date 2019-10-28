import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { always, path } from 'ramda';

import { Container } from './preview.styles';
import { Table } from '../../../shared/components/table';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { Loader } from '../../../shared/components/loader';
import { TopHeader } from '../../../shared/components/topHeader';
import messages from './preview.messages';
import { BackButton, NavigationContainer } from '../../../shared/components/navigation';
import browserHistory from '../../../shared/utils/history';
import { getTableData } from '../../../shared/utils/helpers';

export class Preview extends PureComponent {
  static propTypes = {
    fetchPreview: PropTypes.func.isRequired,
    previewData: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const jobId = path(['match', 'params', 'jobId'], this.props);
      await this.props.fetchPreview({ jobId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleBackClick = () => browserHistory.push(`/job/${path(['match', 'params', 'jobId'], this.props)}`);

  renderTable = props => <Table {...props} numberedRows />;

  renderContent = renderWhenTrueOtherwise(always(<Loader />), () => {
    const data = path(['previewData', 'data'], this.props);
    const tableData = getTableData(data);

    return this.renderTable(tableData);
  });

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        {this.renderContent(this.state.loading)}
        <NavigationContainer>
          <BackButton onClick={this.handleBackClick} />
        </NavigationContainer>
      </Container>
    );
  }
}
