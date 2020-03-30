import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Stepper } from 'schemaUI';

import { contentStyles, Form, NavigationButtons } from './createProjectState.styles';
import messages from './createProjectState.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../project.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { STATES } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import reportError from '../../../shared/utils/reportError';
import { ProjectStateForm } from '../../../shared/components/projectStateForm';

export class CreateProjectState extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    fetchDataSources: PropTypes.func.isRequired,
    dataSources: PropTypes.array.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = getMatchParam(this.props, 'projectId');

      await this.props.fetchDataSources({ projectId, rawList: true });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCancel = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/state`);

  render() {
    const { dataSources, userRole, match, handleSubmit, isSubmitting, isValid } = this.props;
    const { loading, error } = this.state;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Form onSubmit={handleSubmit}>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={<FormattedMessage {...messages.title} />}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_STATE_ID}
        />
        <ProjectTabs active={STATES} url={`/project/${match.params.projectId}`} />
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
          <ProjectStateForm {...this.props} />
        </LoadingWrapper>
        <NavigationContainer fixed contentStyles={contentStyles}>
          <NavigationButtons>
            <BackButton type="button" onClick={this.handleCancel}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid} />
          </NavigationButtons>
          <Stepper steps={3} activeStep={1} />
        </NavigationContainer>
      </Form>
    );
  }
}
