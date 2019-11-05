import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './createFilter.styles';
import { FilterForm } from '../../../../shared/components/filterForm';
import messages from './createFilter.messages';
import { TopHeader } from '../../../../shared/components/topHeader';

export class CreateFilter extends PureComponent {
  static propTypes = {
    fetchFieldsInfo: PropTypes.func.isRequired,
    fieldsInfo: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  async componentDidMount() {
    const dataSourceId = path(['match', 'params', 'dataSourceId'], this.props);
    await this.props.fetchFieldsInfo({ dataSourceId });
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.dataSource.name,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <FilterForm fieldsInfo={this.props.fieldsInfo} />
      </Container>
    );
  }
}
