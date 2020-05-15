import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useHistory, useRouteMatch } from 'react-router';
import Helmet from 'react-helmet';
import { defaultTo, flatten, groupBy, keys, map, pipe, prop } from 'ramda';

import { Container } from './dataSourceTags.styles';
import messages from './dataSourceTags.messages';
import reportError from '../../../shared/utils/reportError';
import { TagSearch } from '../../../shared/components/tagSearch';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { getProjectMenuOptions } from '../../project/project.constants';
import { NavigationContainer, NextButton } from '../../../shared/components/navigation';

export const DataSourceTags = ({
  fetchTagCategories,
  fetchDataSourceTags,
  updateDataSourceTags,
  project,
  tagCategories,
  dataSource,
  userRole,
  tags,
}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const intl = useIntl();
  const history = useHistory();
  const match = useRouteMatch();
  const initialValues = pipe(
    defaultTo([]),
    map(item => ({ ...item, label: item.value })),
    groupBy(prop('category'))
  )(tags);
  const { values, setFieldValue, handleSubmit, isSubmitting, dirty } = useFormik({
    initialValues,
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      try {
        const formData = pipe(
          keys,
          map(key => map(({ value }) => ({ category: parseInt(key, 10), value }))(data[key])),
          flatten
        )(data);
        await updateDataSourceTags({ dataSourceId: dataSource.id, formData });
        setSubmitting(false);
      } catch (errors) {
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      }
    },
  });
  const headerTitle = dataSource.name;
  const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
  const menuOptions = getProjectMenuOptions(project.id);

  useEffectOnce(() => {
    (async () => {
      try {
        const fetchTagCategoriesPromise = fetchTagCategories({ projectId: project.id, type: 'dataset' });
        const fetchDataSourceTagsPromise = fetchDataSourceTags({ dataSourceId: dataSource.id });
        await Promise.all([fetchDataSourceTagsPromise, fetchTagCategoriesPromise]);
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.subTitle)} />
      <MobileMenu
        headerTitle={headerTitle}
        headerSubtitle={headerSubtitle}
        options={filterMenuOptions(menuOptions, userRole)}
      />
      <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
        <DataSourceNavigation history={history} match={match} dataSource={dataSource} />
      </ContextHeader>
      <LoadingWrapper loading={loading} error={error}>
        <TagSearch tagCategories={tagCategories} values={values} setFieldValue={setFieldValue} />
        <NavigationContainer right fixed padding="10px 0 70px">
          <NextButton onClick={handleSubmit} loading={isSubmitting} disabled={!dirty || isSubmitting}>
            <FormattedMessage {...messages.save} />
          </NextButton>
        </NavigationContainer>
      </LoadingWrapper>
    </Container>
  );
};

DataSourceTags.propTypes = {
  fetchTagCategories: PropTypes.func.isRequired,
  fetchDataSourceTags: PropTypes.func.isRequired,
  updateDataSourceTags: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  dataSource: PropTypes.object.isRequired,
  tagCategories: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  tags: PropTypes.array,
};
