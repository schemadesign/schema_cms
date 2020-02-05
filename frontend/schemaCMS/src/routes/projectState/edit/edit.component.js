import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Stepper } from 'schemaUI';

import { Form } from './edit.styles';
import messages from './edit.messages';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../../project/project.constants';
import { contentStyles, NavigationButtons } from '../../project/createProjectState/createProjectState.styles';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ProjectStateForm } from '../../../shared/components/projectStateForm';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

export class Edit extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    fetchDataSources: PropTypes.func.isRequired,
    dataSources: PropTypes.array.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = this.props.state.project;

      await this.props.fetchDataSources({ projectId, rawList: true });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCancel = () => this.props.history.push(`/project/${this.props.state.project}/state`);

  render() {
    const { userRole, handleSubmit, isSubmitting, isValid, state } = this.props;
    const { loading, error } = this.state;
    const projectId = state.project;
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={<FormattedMessage {...messages.title} />}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_STATE_ID}
        />
        <ContextHeader
          title={<FormattedMessage {...messages.title} />}
          subtitle={<FormattedMessage {...messages.subTitle} />}
        />
        <Form onSubmit={handleSubmit}>
          <LoadingWrapper loading={loading} error={error}>
            <ProjectStateForm {...this.props} />
          </LoadingWrapper>
          <NavigationContainer fixed contentStyles={contentStyles}>
            <NavigationButtons>
              <BackButton type="button" onClick={this.handleCancel} />
              <NextButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid} />
            </NavigationButtons>
            <Stepper steps={3} activeStep={1} />
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
