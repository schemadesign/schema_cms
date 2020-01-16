import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './filter.styles';
import messages from './filter.messages';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { FilterForm } from '../../shared/components/filterForm';
import { ContextHeader } from '../../shared/components/contextHeader';
import { getMatchParam } from '../../shared/utils/helpers';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import { FILTER_MENU_OPTIONS } from './filter.constants';

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
      const filterId = getMatchParam(this.props, 'filterId');
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
    const headerConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <MobileMenu {...headerConfig} options={FILTER_MENU_OPTIONS} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
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
