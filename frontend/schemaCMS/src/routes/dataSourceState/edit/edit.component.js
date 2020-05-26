import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Stepper } from 'schemaUI';

import { LinkContainer } from './edit.styles';
import messages from './edit.messages';
import { contentStyles, NavigationButtons } from '../../../shared/components/navigationStyles';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../../project/project.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceStateForm } from '../../../shared/components/dataSourceStateForm';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import { Link } from '../../../theme/typography';

export class Edit extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    removeState: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    userRole: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  state = {
    confirmationModalOpen: false,
    removeLoading: false,
  };

  handleCancel = () => this.props.history.push(`/project/${this.props.state.project}/state`);

  handleSubmit = () => {
    const { dirty, handleSubmit, history, state } = this.props;
    const redirectUrl = `/state/${state.id}/tags`;

    if (dirty) {
      return handleSubmit();
    }

    return history.push(redirectUrl);
  };

  handleRemoveState = () => this.setState({ confirmationModalOpen: true });

  handleCancelRemove = () => this.setState({ confirmationModalOpen: false });

  handleConfirmRemove = async () => {
    try {
      this.setState({ removeLoading: true });

      const { id, project } = this.props.state;
      await this.props.removeState({ stateId: id, projectId: project });
    } catch (error) {
      this.setState({ removeLoading: false });
      reportError(error);
    }
  };

  render() {
    const { userRole, isSubmitting, state } = this.props;
    const { confirmationModalOpen, removeLoading } = this.state;
    const projectId = state.project;
    const menuOptions = getProjectMenuOptions(projectId);
    const title = state.name;

    return (
      <Fragment>
        <Helmet title={title} />
        <MobileMenu
          headerTitle={title}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_STATE_ID}
        />
        <ContextHeader title={title} subtitle={<FormattedMessage {...messages.subTitle} />} />
        <DataSourceStateForm {...this.props} />
        <LinkContainer>
          <Link onClick={this.handleRemoveState}>
            <FormattedMessage {...messages.deleteState} />
          </Link>
        </LinkContainer>
        <NavigationContainer fixed contentStyles={contentStyles}>
          <NavigationButtons>
            <BackButton type="button" onClick={this.handleCancel}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton type="submit" onClick={this.handleSubmit} loading={isSubmitting} disabled={isSubmitting} />
          </NavigationButtons>
          <Stepper steps={3} activeStep={1} />
        </NavigationContainer>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={this.handleCancelRemove} disabled={removeLoading}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="confirmRemovalBtn"
              onClick={this.handleConfirmRemove}
              loading={removeLoading}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </Fragment>
    );
  }
}
