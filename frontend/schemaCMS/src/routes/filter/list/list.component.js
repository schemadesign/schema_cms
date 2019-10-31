import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, always } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container, NoFields } from './list.styles';
import browserHistory from '../../../shared/utils/history';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';

export class List extends PureComponent {
  static propTypes = {
    fetchDataSource: PropTypes.func.isRequired,
    fetchDataSourcePreview: PropTypes.func.isRequired,
    dataSourcePreview: PropTypes.object.isRequired,
  };

  async componentDidMount() {
    try {
      await this.props.fetchDataSource(path(['match', 'params'], this.props));
      await this.props.fetchDataSourcePreview(path(['match', 'params'], this.props));
    } catch (e) {
      browserHistory.push('/');
    }
  }

  renderDataSourceFields = datasource =>
    renderWhenTrueOtherwise(
      always(
        <NoFields>
          <FormattedMessage {...messages.noFields} />
        </NoFields>
      ),
      () => ({})
    )(isEmpty(datasource));

  render() {
    const { dataSource } = this.props;

    return <Container>{this.renderDataSourceFields(dataSource)}</Container>;
  }
}
