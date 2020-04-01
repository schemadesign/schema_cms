import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useEffectOnce } from 'react-use';
import { useHistory, useLocation, useParams } from 'react-router';
import { useFormik } from 'formik';
import { is } from 'ramda';

import { Container } from './createPage.styles';
import messages from './createPage.messages';
import { PageForm } from '../../../shared/components/pageForm';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions, preparePageData } from '../../../shared/utils/helpers';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { INITIAL_VALUES, PAGE_SCHEMA, PAGE_TEMPLATE } from '../../../modules/page/page.constants';
import reportError from '../../../shared/utils/reportError';
import { getProjectMenuOptions } from '../../project/project.constants';

export const CreatePage = ({
  pageTemplates,
  userRole,
  createPage,
  fetchPageTemplates,
  blockTemplates,
  fetchBlockTemplates,
  project,
}) => {
  const intl = useIntl();
  const { sectionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const history = useHistory();
  const { state = {} } = useLocation();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const projectId = project.id;
  const menuOptions = getProjectMenuOptions(projectId);
  const { handleSubmit, isValid, dirty, setFieldValue, setValues, values, ...restFormikProps } = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: () => PAGE_SCHEMA,
    onSubmit: async (data, { setErrors }) => {
      try {
        setCreateLoading(true);

        const formData = preparePageData(data);
        const { id } = await createPage({ formData, sectionId });
        history.push(`/page/${id}`);
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
        setCreateLoading(false);
      }
    },
  });

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchPageTemplates({ projectId });
        await fetchBlockTemplates({ projectId });
        const { page = {} } = state;

        if (is(Number, page[PAGE_TEMPLATE])) {
          setValues(page);
        }
        history.replace({ state: {} });
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
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <LoadingWrapper loading={loading} error={error}>
        <form onSubmit={handleSubmit}>
          <PageForm
            title={title}
            pageTemplates={pageTemplates}
            isValid={isValid}
            setFieldValue={setFieldValue}
            setValues={setValues}
            values={values}
            blockTemplates={blockTemplates}
            {...restFormikProps}
          />
          <NavigationContainer fixed>
            <BackButton id="cancelBtn" type="button" onClick={() => history.push(`/section/${sectionId}`)}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton
              id="createPage"
              type="submit"
              loading={createLoading}
              disabled={!isValid || !dirty || createLoading}
            >
              <FormattedMessage {...messages.create} />
            </NextButton>
          </NavigationContainer>
        </form>
      </LoadingWrapper>
    </Container>
  );
};

CreatePage.propTypes = {
  pageTemplates: PropTypes.array.isRequired,
  userRole: PropTypes.string.isRequired,
  createPage: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  fetchPageTemplates: PropTypes.func.isRequired,
  fetchBlockTemplates: PropTypes.func.isRequired,
};
