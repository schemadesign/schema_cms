import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useEffectOnce } from 'react-use';
import { useHistory, useParams } from 'react-router';
import { useFormik } from 'formik';

import { Container } from './createPage.styles';
import messages from './createPage.messages';
import { PageForm } from '../../../shared/components/pageForm';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { INITIAL_VALUES, PAGE_SCHEMA } from '../../../modules/page/page.constants';
import reportError from '../../../shared/utils/reportError';
import { getProjectMenuOptions } from '../../project/project.constants';

export const CreatePage = ({ pageTemplates, userRole, createPage, fetchPageTemplates, fetchSection, project }) => {
  const intl = useIntl();
  const { sectionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const history = useHistory();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(project.id);
  const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: () => PAGE_SCHEMA,
    onSubmit: async formData => {
      try {
        setCreateLoading(true);
        const { id } = await createPage({ formData, sectionId });
        history.push(`/page/${id}`);
      } catch (e) {
        reportError(e);
        setCreateLoading(false);
      }
    },
  });

  useEffectOnce(() => {
    (async () => {
      try {
        const { project } = await fetchSection({ sectionId });
        await fetchPageTemplates({ projectId: project });
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
          <PageForm title={title} pageTemplates={pageTemplates} isValid={isValid} {...restFormikProps} />
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
  fetchPageTemplates: PropTypes.func.isRequired,
  fetchSection: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
