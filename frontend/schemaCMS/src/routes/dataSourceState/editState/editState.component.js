import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { useHistory } from 'react-router';
import Helmet from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import { Form } from 'schemaUI';
import { groupBy, toPairs, map, prop, pipe } from 'ramda';

import messages from './editState.messages';
import { LinkContainer } from './editState.styles';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions, formatTags, prepareTags } from '../../../shared/utils/helpers';
import { DATA_SOURCE_STATE_ID, getProjectMenuOptions } from '../../project/project.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceStateForm } from '../../../shared/components/dataSourceStateForm';
import { Link } from '../../../theme/typography';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { contentStyles, NavigationButtons } from '../../../shared/components/navigationStyles';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import {
  DATA_SOURCE_STATE_FILTERS,
  DATA_SOURCE_STATE_IS_PUBLIC,
  DATA_SOURCE_STATE_SCHEMA,
  DATA_SOURCE_STATE_TAGS,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { TagSearch } from '../../../shared/components/tagSearch';
import { StateFilterList } from '../stateFilterList';

const { Label, Switch } = Form;

export const EditState = ({
  project,
  removeState,
  userRole,
  updateState,
  state,
  dataSourceTags,
  fetchDataSourceTags,
  fetchFilters,
  filters,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const history = useHistory();
  const intl = useIntl();
  const title = state.name;
  const menuOptions = getProjectMenuOptions(project.id);
  const tagCategories = pipe(
    groupBy(prop('categoryName')),
    toPairs,
    map(([name, tags]) => ({ name, id: tags[0].category, tags }))
  )(dataSourceTags);

  useEffectOnce(() => {
    (async () => {
      try {
        const dataSourceId = state.datasource;
        await fetchDataSourceTags({ dataSourceId });
        await fetchFilters({ dataSourceId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  const { values, handleSubmit, isSubmitting, dirty, ...restFormikProps } = useFormik({
    initialValues: {
      ...state,
      tags: prepareTags(state.tags),
      filters: state.filters.map(({ filter }) => filter),
    },
    enableReinitialize: true,
    validationSchema: () => DATA_SOURCE_STATE_SCHEMA,
    onSubmit: async (formData, { setSubmitting, setErrors }) => {
      try {
        const formattedFilters = state.filters.filter(({ filter }) => values.filters.includes(filter));
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
        <Label>
          <FormattedMessage {...messages[DATA_SOURCE_STATE_TAGS]} />
        </Label>
        <TagSearch
          tagCategories={tagCategories}
          values={values.tags}
          valuePath="tags"
          setFieldValue={restFormikProps.setFieldValue}
        />
        <StateFilterList
          filters={filters}
          state={state}
          values={values[DATA_SOURCE_STATE_FILTERS]}
          {...restFormikProps}
        />
        <Switch
          value={values[DATA_SOURCE_STATE_IS_PUBLIC]}
          id={DATA_SOURCE_STATE_IS_PUBLIC}
          onChange={restFormikProps.handleChange}
          label={intl.formatMessage(messages[DATA_SOURCE_STATE_IS_PUBLIC])}
        />
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
            <NextButton type="submit" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting || !dirty}>
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

EditState.propTypes = {
  removeState: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  fetchDataSourceTags: PropTypes.func.isRequired,
  fetchFilters: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  dataSourceTags: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  state: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
