import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './createFilter.styles';
import { FilterForm } from '../../../../shared/components/filterForm';
import messages from './createFilter.messages';
import { TopHeader } from '../../../../shared/components/topHeader';
import { renderWhenTrueOtherwise } from '../../../../shared/utils/rendering';
import { Loader } from '../../../../shared/components/loader';
import { FILTERS_STEP } from '../../../../modules/dataSource/dataSource.constants';

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
  };

  async componentDidMount() {
    const dataSourceId = this.getDataSourceId(this.props);

    try {
      await this.props.fetchFieldsInfo({ dataSourceId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push(`datasource/${dataSourceId}/${FILTERS_STEP}`);
    }
  }

  getDataSourceId = path(['match', 'params', 'dataSourceId']);

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.dataSource.name,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  renderFilterForm = renderWhenTrueOtherwise(always(<Loader />), () => (
    <FilterForm
      fieldsInfo={this.props.fieldsInfo}
      createFilter={this.props.createFilter}
      history={this.props.history}
      dataSourceId={this.getDataSourceId(this.props)}
    />
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
