import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import { Form, NavigationButtons, contentStyles } from './createDataSourceState.styles';
import messages from './createDataSourceState.messages';
import { getMatchParam } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, ConfirmLink } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import reportError from '../../../shared/utils/reportError';
import { DataSourceStateForm } from '../../../shared/components/dataSourceStateForm';

export class CreateDataSourceState extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    fetchDataSources: PropTypes.func.isRequired,
    dataSources: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = this.props.project.id;

      await this.props.fetchDataSources({ projectId, rawList: true });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCancel = () => this.props.history.push(`/datasource/${getMatchParam(this.props, 'dataSourceId')}/state`);

  render() {
    const { dataSources, handleSubmit, isSubmitting, isValid } = this.props;
    const { loading, error } = this.state;

    return (
      <Form onSubmit={handleSubmit}>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <ContextHeader
          title={<FormattedMessage {...messages.title} />}
          subtitle={<FormattedMessage {...messages.subTitle} />}
        />
        <LoadingWrapper
          loading={loading}
          error={error}
          noData={!dataSources.length}
          noDataContent={<FormattedMessage {...messages.noData} />}
        >
          <DataSourceStateForm {...this.props} />
        </LoadingWrapper>
        <NavigationContainer fixed contentStyles={contentStyles}>
          <NavigationButtons>
            <BackButton type="button" onClick={this.handleCancel}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <ConfirmLink type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid}>
              <FormattedMessage {...messages.confirm} />
            </ConfirmLink>
          </NavigationButtons>
        </NavigationContainer>
      </Form>
    );
  }
}
