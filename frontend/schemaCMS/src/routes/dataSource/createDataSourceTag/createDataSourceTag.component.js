import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Form } from './createDataSourceTag.styles';
import messages from './createDataSourceTag.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { DataSourceTagForm } from '../../../shared/components/dataSourceTagForm';
import { getProjectMenuOptions } from '../../project/project.constants';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { TAGS_PAGE } from '../../../modules/dataSource/dataSource.constants';

export class CreateDataSourceTag extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    dataSource: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.props.dataSource.name,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleBack = () => this.props.history.push(`/datasource/${getMatchParam(this.props, 'dataSourceId')}/${TAGS_PAGE}`);

  render() {
    const { dataSource, userRole, isSubmitting, isValid, dirty, handleSubmit } = this.props;
    const headerConfig = this.getHeaderAndMenuConfig();
    const menuOptions = getProjectMenuOptions(dataSource.project.id);

    return (
      <Form onSubmit={handleSubmit}>
        <MobileMenu
          headerTitle={headerConfig.headerTitle}
          headerSubtitle={headerConfig.headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <DataSourceTagForm {...this.props} />
        <NavigationContainer fixed>
          <BackButton onClick={this.handleBack} type="button">
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton loading={isSubmitting} disabled={!dirty || !isValid || isSubmitting} type="submit">
            <FormattedMessage {...messages.saveTag} />
          </NextButton>
        </NavigationContainer>
      </Form>
    );
  }
}
