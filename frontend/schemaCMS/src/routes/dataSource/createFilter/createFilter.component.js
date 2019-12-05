import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './createFilter.styles';
import { FilterForm } from '../../../shared/components/filterForm';
import messages from './createFilter.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';

export class CreateFilter extends PureComponent {
  static propTypes = {
    fetchFieldsInfo: PropTypes.func.isRequired,
    createFilter: PropTypes.func.isRequired,
    fieldsInfo: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    const dataSourceId = this.getDataSourceId(this.props);

    try {
      await this.props.fetchFieldsInfo({ dataSourceId });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  getDataSourceId = path(['match', 'params', 'dataSourceId']);

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.dataSource.name,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  renderContent = () => (
    <FilterForm
      fieldsInfo={this.props.fieldsInfo}
      createFilter={this.props.createFilter}
      history={this.props.history}
      dataSourceId={this.getDataSourceId(this.props)}
    />
  );

  render() {
    const { error, loading } = this.state;
    const headerConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent}
        </LoadingWrapper>
      </Container>
    );
  }
}
