import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './filter.styles';
import messages from './filter.messages';
import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { Loader } from '../../shared/components/loader';
import { FilterForm } from '../../shared/components/filterForm';
import { TopHeader } from '../../shared/components/topHeader';

export class Filter extends PureComponent {
  static propTypes = {
    updateFilter: PropTypes.func.isRequired,
    fetchFieldsInfo: PropTypes.func.isRequired,
    fieldsInfo: PropTypes.object.isRequired,
    fetchFilter: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    const filterId = path(['match', 'params', 'filterId'], this.props);
    const { datasource: dataSourceId } = await this.props.fetchFilter({ filterId });
    await this.props.fetchFieldsInfo({ dataSourceId });
    this.setState({ loading: false });
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.filter.datasourceName,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  renderFilterForm = renderWhenTrueOtherwise(always(<Loader />), () => (
    <FilterForm fieldsInfo={this.props.fieldsInfo} updateFilter={this.props.updateFilter} filter={this.props.filter} />
  ));

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        {this.renderFilterForm(this.state.loading)}
      </Container>
    );
  }
}
