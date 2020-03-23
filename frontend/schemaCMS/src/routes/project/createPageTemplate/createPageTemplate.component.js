import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffectOnce } from 'react-use';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import { useFormik } from 'formik';
import { pick } from 'ramda';

import { Container } from './createPageTemplate.styles';
import messages from './createPageTemplate.messages';
import reportError from '../../../shared/utils/reportError';
import { getProjectMenuOptions } from '../project.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import {
  PAGE_TEMPLATES_SCHEMA,
  INITIAL_VALUES,
  PAGE_TEMPLATES_NAME,
  PAGE_TEMPLATES_BLOCKS,
  BLOCK_NAME,
  BLOCK_TYPE,
  BLOCK_ID,
  getDefaultPageBlock,
} from '../../../modules/pageTemplates/pageTemplates.constants';
import { PageTemplateForm } from '../../../shared/components/pageTemplateForm';

export const CreatePageTemplate = ({ userRole, createPageTemplate, fetchBlockTemplates, blockTemplates }) => {
  const intl = useIntl();
  const { projectId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: { ...INITIAL_VALUES, [PAGE_TEMPLATES_BLOCKS]: [getDefaultPageBlock()] },
    validationSchema: () => PAGE_TEMPLATES_SCHEMA,
    initialErrors: { [PAGE_TEMPLATES_NAME]: 'required' },
    onSubmit: async formData => {
      try {
        setCreateLoading(true);
        await createPageTemplate({
          projectId,
          formData: {
            ...formData,
            [PAGE_TEMPLATES_BLOCKS]: formData[PAGE_TEMPLATES_BLOCKS].map((block, index) => ({
              ...pick([BLOCK_NAME, BLOCK_TYPE, BLOCK_ID])(block),
              order: index,
            })),
          },
        });
        history.push(`/project/${projectId}/page-templates`);
      } catch (e) {
        reportError(e);
        setCreateLoading(false);
      }
    },
  });
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchBlockTemplates({ projectId, raw: true });
      } catch (e) {
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
          <PageTemplateForm title={title} blockTemplates={blockTemplates} isValid={isValid} {...restFormikProps} />
          <NavigationContainer fixed>
            <BackButton
              id="cancelBtn"
              type="button"
              onClick={() => history.push(`/project/${projectId}/page-templates`)}
            >
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton
              id="createTemplateBlock"
              type="submit"
              loading={createLoading}
              disabled={!isValid || !dirty || createLoading}
            >
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </form>
      </LoadingWrapper>
    </Container>
  );
};

CreatePageTemplate.propTypes = {
  userRole: PropTypes.string.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  createPageTemplate: PropTypes.func.isRequired,
  fetchBlockTemplates: PropTypes.func.isRequired,
};
