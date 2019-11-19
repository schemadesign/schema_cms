import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { always, path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './filter.styles';
import messages from './filter.messages';
import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { Loading } from '../../shared/components/loading';
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
    headerTitle: this.props.filter.datasource.name,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  renderContent = renderWhenTrueOtherwise(always(<Loading />), () => (
    <Fragment>
      <TopHeader {...this.getHeaderAndMenuConfig()} />
      <FilterForm
        fieldsInfo={this.props.fieldsInfo}
        updateFilter={this.props.updateFilter}
        filter={this.props.filter}
        removeFilter={this.props.removeFilter}
        history={this.props.history}
        dataSourceId={this.props.filter.datasource.id}
      />
    </Fragment>
  ));

  render() {
    return <Container>{this.renderContent(this.state.loading)}</Container>;
  }
}
