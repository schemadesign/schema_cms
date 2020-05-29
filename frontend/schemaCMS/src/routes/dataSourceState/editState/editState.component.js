import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { useHistory, useLocation, useParams } from 'react-router';
import Helmet from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { pick } from 'ramda';

import messages from './editState.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import {
  errorMessageParser,
  filterMenuOptions,
  formatTags,
  getStateInitialValues,
  getTagCategories,
} from '../../../shared/utils/helpers';
import { DATA_SOURCE_STATE_ID, getProjectMenuOptions } from '../../project/project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceStateForm } from '../../../shared/components/dataSourceStateForm';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import {
  DATA_SOURCE_STATE_ACTIVE_FILTERS,
  DATA_SOURCE_STATE_FILTERS,
  DATA_SOURCE_STATE_SCHEMA,
  REQUEST_KEYS,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { SOURCES } from '../../../shared/components/projectTabs/projectTabs.constants';

export const EditState = ({
  project,
  removeState,
  userRole,
  updateState,
  state,
  dataSourceTags,
  fetchDataSourceTags,
  fetchFilters,
  fetchState,
  filters,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const history = useHistory();
  const { state: locationState = {} } = useLocation();
  const { stateId } = useParams();
  const intl = useIntl();
  const title = state.name;
  const menuOptions = getProjectMenuOptions(project.id);
  const tagCategories = getTagCategories(dataSourceTags);

  const { values, handleSubmit, isSubmitting, dirty, setValues, ...restFormikProps } = useFormik({
    initialValues: getStateInitialValues(state),
    enableReinitialize: true,
    validationSchema: () => DATA_SOURCE_STATE_SCHEMA,
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      try {
        const formattedFilters = data[DATA_SOURCE_STATE_FILTERS].filter(({ filter }) =>
          data[DATA_SOURCE_STATE_ACTIVE_FILTERS].includes(filter)
        );
        const formData = pick(REQUEST_KEYS, data);

        await updateState({
          stateId: state.id,
          formData: { ...formData, tags: formatTags(formData.tags), filters: formattedFilters },
        });
        setSubmitting(false);
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      }
    },
  });

  useEffectOnce(() => {
    (async () => {
      try {
        const state = await fetchState({ stateId });
        const dataSourceId = state.datasource;
        const fetchDataSourceTagsPromise = fetchDataSourceTags({ dataSourceId });
        const fetchFiltersPromise = fetchFilters({ dataSourceId });

        await Promise.all([fetchDataSourceTagsPromise, fetchFiltersPromise]);

        if (locationState.state) {
          setValues(getStateInitialValues(locationState.state));
          history.replace({ state: {} });
        }
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  const handleCancel = () => history.push(`/datasource/${state.datasource}/state`);
  const handleRemoveState = () => setConfirmationModalOpen(true);
  const handleCancelRemove = () => setConfirmationModalOpen(false);
  const handleConfirmRemove = async () => {
    try {
      setRemoveLoading(true);

      await removeState({ stateId: state.id, dataSourceId: state.datasource });
    } catch (e) {
      setRemoveLoading(false);
      reportError(e);
    }
  };

  return (
    <Fragment>
      <LoadingWrapper loading={loading} error={error}>
        <Helmet title={title} />
        <ProjectTabs active={SOURCES} url={`/project/${project.id}`} />
        <MobileMenu
          headerTitle={title}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={DATA_SOURCE_STATE_ID}
        />
        <ContextHeader title={title} subtitle={<FormattedMessage {...messages.subTitle} />} />
        <DataSourceStateForm
          values={values}
          intl={intl}
          filters={filters}
          state={state}
          tagCategories={tagCategories}
          handleRemoveState={handleRemoveState}
          {...restFormikProps}
        />
        <NavigationContainer fixed>
          <BackButton type="button" onClick={handleCancel}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          <NextButton type="submit" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting || !dirty}>
            <FormattedMessage {...messages.save} />
          </NextButton>
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

EditState.propTypes = {
  removeState: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  fetchDataSourceTags: PropTypes.func.isRequired,
  fetchFilters: PropTypes.func.isRequired,
  fetchState: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  dataSourceTags: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
