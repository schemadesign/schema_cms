import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormik } from 'formik';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import { useEffectOnce } from 'react-use';
import { pick, map } from 'ramda';

import { Container } from './blockTemplate.styles';
import messages from './blockTemplate.messages';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../shared/utils/helpers';
import {
  BLOCK_TEMPLATES_SCHEMA,
  ELEMENT_ID,
  ELEMENT_NAME,
  ELEMENT_PARAMS,
  ELEMENT_TYPE,
} from '../../modules/blockTemplates/blockTemplates.constants';
import { BlockTemplateForm } from '../../shared/components/blockTemplateForm';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { getProjectMenuOptions } from '../project/project.constants';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import reportError from '../../shared/utils/reportError';

export const BlockTemplate = memo(
  ({
    updateBlockTemplate,
    fetchBlockTemplate,
    fetchBlockTemplates,
    userRole,
    blockTemplate: { name, elements },
    blockTemplates,
    project,
  }) => {
    const { blockTemplateId } = useParams();
    const history = useHistory();
    const intl = useIntl();
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState(null);
    const menuOptions = getProjectMenuOptions();
    const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
      initialValues: {
        name,
        elements: map(pick([ELEMENT_NAME, ELEMENT_TYPE, ELEMENT_ID, ELEMENT_PARAMS]), elements),
      },
      enableReinitialize: true,
      validationSchema: () => BLOCK_TEMPLATES_SCHEMA,
      onSubmit: async formData => {
        try {
          setUpdateLoading(true);
          formData.elements = formData.elements.map((data, index) => ({ ...data, order: index }));
          await updateBlockTemplate({ blockTemplateId, formData });
          setUpdateLoading(false);
          history.push(`/project/${project.id}/block-templates`);
        } catch (e) {
          reportError(e);
          setUpdateLoading(false);
        }
      },
    });
    useEffectOnce(() => {
      (async () => {
        try {
          const { project } = await fetchBlockTemplate({ blockTemplateId });
          await fetchBlockTemplates({ projectId: project });
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      })();
    });
    const title = <FormattedMessage {...messages.title} />;
    const subtitle = <FormattedMessage {...messages.subtitle} />;

    return (
      <Container>
        <Helmet title={intl.formatMessage(messages.title)} />
        <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
        <LoadingWrapper loading={loading} error={error}>
          <form onSubmit={handleSubmit}>
            <BlockTemplateForm title={title} blockTemplates={blockTemplates} {...restFormikProps} />
            <NavigationContainer fixed>
              <BackButton
                id="cancelBtn"
                type="button"
                onClick={() => history.push(`/project/${project.id}/block-templates`)}
              >
                <FormattedMessage {...messages.cancel} />
              </BackButton>
              <NextButton
                id="createTemplateBlockMobile"
                type="submit"
                loading={updateLoading}
                disabled={!isValid || !dirty || updateLoading}
              >
                <FormattedMessage {...messages.save} />
              </NextButton>
            </NavigationContainer>
          </form>
        </LoadingWrapper>
      </Container>
    );
  }
);

BlockTemplate.propTypes = {
  blockTemplate: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  fetchBlockTemplate: PropTypes.func.isRequired,
  updateBlockTemplate: PropTypes.func.isRequired,
  fetchBlockTemplates: PropTypes.func.isRequired,
};
