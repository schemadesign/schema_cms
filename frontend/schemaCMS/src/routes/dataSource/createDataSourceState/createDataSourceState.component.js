import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import { useHistory, useLocation, useParams } from 'react-router';
import { pick } from 'ramda';

import { Form, NavigationButtons, contentStyles } from './createDataSourceState.styles';
import messages from './createDataSourceState.messages';
import {
  errorMessageParser,
  formatTags,
  getStateInitialValues,
  getTagCategories,
  filterMenuOptions,
} from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { DataSourceStateForm } from '../../../shared/components/dataSourceStateForm';
import {
  DATA_SOURCE_STATE_ACTIVE_FILTERS,
  DATA_SOURCE_STATE_FILTERS,
  DATA_SOURCE_STATE_SCHEMA,
  INITIAL_VALUES,
  REQUEST_KEYS,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { getProjectMenuOptions } from '../../project/project.constants';

export const CreateDataSourceState = ({
  fetchFilters,
  fetchDataSourceTags,
  createState,
  filters,
  dataSourceTags,
  project,
  userRole,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  const { state: locationState = {} } = useLocation();
  const { dataSourceId } = useParams();
  const intl = useIntl();
  const tagCategories = getTagCategories(dataSourceTags);

  const { handleSubmit, isSubmitting, isValid, dirty, setValues, ...restFormikProps } = useFormik({
    enableReinitialize: true,
    initialValues: INITIAL_VALUES,
    validationSchema: () => DATA_SOURCE_STATE_SCHEMA,
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const formattedFilters = data[DATA_SOURCE_STATE_FILTERS].filter(({ filter }) =>
          data[DATA_SOURCE_STATE_ACTIVE_FILTERS].includes(filter)
        );
        const formData = pick(REQUEST_KEYS, data);

        await createState({
          formData: { ...formData, tags: formatTags(formData.tags) },
          dataSourceId,
          filters: formattedFilters,
        });
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

  const handleCancel = () => history.push(`/datasource/${dataSourceId}/state`);
  const title = <FormattedMessage {...messages.title} />;
  const subTitle = <FormattedMessage {...messages.subTitle} />;
  const menuOptions = getProjectMenuOptions(project.id);

  return (
    <Form onSubmit={handleSubmit}>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu headerTitle={title} headerSubtitle={subTitle} options={filterMenuOptions(menuOptions, userRole)} />
      <ContextHeader title={title} subtitle={subTitle} />
      <LoadingWrapper loading={loading} error={error} noDataContent={<FormattedMessage {...messages.noData} />}>
        <DataSourceStateForm tagCategories={tagCategories} filters={filters} {...restFormikProps} />
      </LoadingWrapper>
      <NavigationContainer fixed contentStyles={contentStyles}>
        <NavigationButtons>
          <BackButton type="button" onClick={handleCancel}>
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton type="submit" loading={isSubmitting} disabled={isSubmitting || !isValid || !dirty}>
            <FormattedMessage {...messages.create} />
          </NextButton>
        </NavigationButtons>
      </NavigationContainer>
    </Form>
  );
};

CreateDataSourceState.propTypes = {
  fetchFilters: PropTypes.func.isRequired,
  fetchDataSourceTags: PropTypes.func.isRequired,
  createState: PropTypes.func.isRequired,
  dataSourceTags: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
