import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './createDataSourceTag.styles';
import messages from './createDataSourceTag.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getDataSourceMenuOptions } from '../dataSource.constants';
import { DataSourceTagForm } from '../../../shared/components/dataSourceTagForm';

export class CreateDataSourceTag extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    createTag: PropTypes.func.isRequired,
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

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.dataSource.name,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  renderContent = () => (
    <DataSourceTagForm
      createTag={this.props.createTag}
      dataSourceId={getMatchParam(this.props, 'dataSourceId')}
      history={this.props.history}
      intl={this.props.intl}
    />
  );

  render() {
    const { dataSource, userRole, createTag, history, intl } = this.props;
    const headerConfig = this.getHeaderAndMenuConfig();
    const menuOptions = getDataSourceMenuOptions(dataSource.project.id);

    return (
      <Container>
        <MobileMenu
          headerTitle={headerConfig.headerTitle}
          headerSubtitle={headerConfig.headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <DataSourceTagForm
          createTag={createTag}
          dataSourceId={getMatchParam(this.props, 'dataSourceId')}
          history={history}
          intl={intl}
        />
      </Container>
    );
  }
}
