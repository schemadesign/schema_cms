import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';

import messages from './dataSourceState.messages';
import { LinkContainer } from './dataSourceState.styles';
import { ProjectTabs } from '../../shared/components/projectTabs';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import reportError from '../../shared/utils/reportError';
import { SOURCES } from '../../shared/components/projectTabs/projectTabs.constants';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../shared/utils/helpers';
import { DATA_SOURCE_STATE_ID, getProjectMenuOptions } from '../project/project.constants';
import { ContextHeader } from '../../shared/components/contextHeader';
import { DataSourceStateForm } from '../../shared/components/dataSourceStateForm';
import { Link } from '../../theme/typography';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { contentStyles, NavigationButtons } from '../../shared/components/navigationStyles';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../shared/components/modal/modal.styles';
import { DATA_SOURCE_STATE_SCHEMA } from '../../modules/dataSourceState/dataSourceState.constants';

export const DataSourceState = ({ fetchState, project, removeState, userRole, updateState, state }) => {
  const [loading, setLoading] = useState(true);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState(null);
  const { stateId } = useParams();
  const history = useHistory();
  const intl = useIntl();
  const title = state.name;
  const menuOptions = getProjectMenuOptions(project.id);

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchState({ stateId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  const { values, handleSubmit, isSubmitting, ...restFormikProps } = useFormik({
    initialValues: state,
    enableReinitialize: true,
    validationSchema: () => DATA_SOURCE_STATE_SCHEMA,
    onSubmit: async (formData, { setSubmitting, setErrors }) => {
      try {
        await updateState({ stateId: state.id, formData });
        setSubmitting(false);
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      }
    },
  });

  const handleCancel = () => history.push(`/datasource/${state.datasource}/state`);
  const handleRemoveState = () => setConfirmationModalOpen(true);
  const handleCancelRemove = () => setConfirmationModalOpen(false);
  const handleConfirmRemove = async () => {
    try {
      setRemoveLoading(true);

      await removeState({ stateId: state.id, projectId: project.id });
    } catch (e) {
      setRemoveLoading(false);
      reportError(e);
    }
  };

  return (
    <Fragment>
      <ProjectTabs active={SOURCES} url={`/project/${project.id}`} />
      <LoadingWrapper loading={loading} error={error}>
        <Helmet title={title} />
        <MobileMenu
          headerTitle={title}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={DATA_SOURCE_STATE_ID}
        />
        <ContextHeader title={title} subtitle={<FormattedMessage {...messages.subTitle} />} />
        <DataSourceStateForm values={values} intl={intl} {...restFormikProps} />
        <LinkContainer>
          <Link onClick={handleRemoveState}>
            <FormattedMessage {...messages.deleteState} />
          </Link>
        </LinkContainer>
        <NavigationContainer fixed contentStyles={contentStyles}>
          <NavigationButtons>
            <BackButton type="button" onClick={handleCancel}>
              <FormattedMessage {...messages.back} />
            </BackButton>
            <NextButton type="submit" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationButtons>
        </NavigationContainer>
        <Modal isOpen={confirmationModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
          <ModalTitle>
            <FormattedMessage {...messages.removeTitle} />
          </ModalTitle>
          <ModalActions>
            <BackButton onClick={handleCancelRemove} disabled={removeLoading}>
              <FormattedMessage {...messages.cancelRemoval} />
            </BackButton>
            <NextButton
              id="confirmRemovalBtn"
              onClick={handleConfirmRemove}
              loading={removeLoading}
              disabled={removeLoading}
            >
              <FormattedMessage {...messages.confirmRemoval} />
            </NextButton>
          </ModalActions>
        </Modal>
      </LoadingWrapper>
    </Fragment>
  );
};

DataSourceState.propTypes = {
  fetchState: PropTypes.func.isRequired,
  removeState: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
