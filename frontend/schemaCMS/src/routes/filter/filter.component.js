import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path, pathOr } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './filter.styles';
import messages from './filter.messages';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { FilterForm } from '../../shared/components/filterForm';
import { TopHeader } from '../../shared/components/topHeader';

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
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const filterId = path(['match', 'params', 'filterId'], this.props);
      const data = await this.props.fetchFilter({ filterId });
      await this.props.fetchFieldsInfo({ dataSourceId: data.datasource.id });

      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: pathOr('', ['filter', 'datasource', 'name'], this.props),
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  render() {
    const { loading } = this.state;
    const dataSourceId = pathOr('', ['filter', 'datasource', 'id'], this.props);

    return (
      <Container>
        <TopHeader {...this.getHeaderAndMenuConfig()} />
        <LoadingWrapper loading={loading}>
          <FilterForm
            fieldsInfo={this.props.fieldsInfo}
            updateFilter={this.props.updateFilter}
            filter={this.props.filter}
            removeFilter={this.props.removeFilter}
            history={this.props.history}
            dataSourceId={dataSourceId}
          />
        </LoadingWrapper>
      </Container>
    );
  }
}
