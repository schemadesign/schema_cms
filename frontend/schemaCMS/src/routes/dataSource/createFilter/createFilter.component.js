import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './createFilter.styles';
import { FilterForm } from '../../../shared/components/filterForm';
import messages from './createFilter.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getMatchParam } from '../../../shared/utils/helpers';

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
    intl: PropTypes.object.isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    const dataSourceId = getMatchParam(this.props, 'dataSourceId');

    try {
      await this.props.fetchFieldsInfo({ dataSourceId });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.dataSource.name,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  renderContent = () => (
    <FilterForm
      fieldsInfo={this.props.fieldsInfo}
      createFilter={this.props.createFilter}
      dataSourceId={getMatchParam(this.props, 'dataSourceId')}
      history={this.props.history}
      intl={this.props.intl}
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
