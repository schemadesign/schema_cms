import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './filter.styles';
import messages from './filter.messages';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { FilterForm } from '../../shared/components/filterForm';
import { TopHeader } from '../../shared/components/topHeader';
import { ContextHeader } from '../../shared/components/contextHeader';
import { getMatchParam } from '../../shared/utils/helpers';
import reportError from '../../shared/utils/reportError';

export class Filter extends PureComponent {
  static propTypes = {
    updateFilter: PropTypes.func.isRequired,
    fetchFieldsInfo: PropTypes.func.isRequired,
    fieldsInfo: PropTypes.object.isRequired,
    fetchFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        filterId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const filterId = getMatchParam(this.props, 'filterId');
      const data = await this.props.fetchFilter({ filterId });
      await this.props.fetchFieldsInfo({ dataSourceId: data.datasource.id });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: pathOr('', ['filter', 'datasource', 'name'], this.props),
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  render() {
    const { error, loading } = this.state;
    const dataSourceId = pathOr('', ['filter', 'datasource', 'id'], this.props);
    const headerConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <LoadingWrapper loading={loading} error={error}>
          <FilterForm
            fieldsInfo={this.props.fieldsInfo}
            updateFilter={this.props.updateFilter}
            filter={this.props.filter}
            removeFilter={this.props.removeFilter}
            history={this.props.history}
            dataSourceId={dataSourceId}
            intl={this.props.intl}
          />
        </LoadingWrapper>
      </Container>
    );
  }
}
