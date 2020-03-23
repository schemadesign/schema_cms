import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffectOnce } from 'react-use';
import { useHistory, useParams } from 'react-router';
import { useFormik } from 'formik';
import Helmet from 'react-helmet';
import { pick } from 'ramda';

import { Container } from './page.styles';
import messages from './page.messages';
import reportError from '../../shared/utils/reportError';
import { MobileMenu } from '../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../shared/utils/helpers';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { PageForm } from '../../shared/components/pageForm';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { getProjectMenuOptions } from '../project/project.constants';
import { PAGE_SCHEMA, FORM_VALUES, PAGE_TEMPLATE } from '../../modules/page/page.constants';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../shared/components/modal/modal.styles';

export const Page = ({
  project,
  updatePage,
  page,
  fetchPageTemplates,
  pageTemplates,
  userRole,
  removePage,
  fetchPage,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { pageId } = useParams();
  const history = useHistory();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(project.id);
  const initialValues = { ...pick(FORM_VALUES, page), [PAGE_TEMPLATE]: page[PAGE_TEMPLATE] || 0 };

  const { handleSubmit, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: () => PAGE_SCHEMA,
    onSubmit: async data => {
      try {
        setUpdateLoading(true);
        const formData = { ...data, [PAGE_TEMPLATE]: data[PAGE_TEMPLATE] || null };
        await updatePage({ formData, pageId });
      } catch (e) {
        reportError(e);
      } finally {
        setUpdateLoading(false);
      }
    },
  });
  const handleConfirmRemove = async () => {
    try {
      setRemoveLoading(true);
      await removePage({ pageId });
      history.push(`/section/${page.section}`);
    } catch (e) {
      reportError(e);
      setRemoveLoading(false);
    }
  };

  useEffectOnce(() => {
    (async () => {
      try {
        const { projectId } = await fetchPage({ pageId });
        await fetchPageTemplates({ projectId });
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
            displayName={page.displayName}
            title={title}
            pageTemplates={pageTemplates}
            isValid={isValid}
            setRemoveModalOpen={setRemoveModalOpen}
            {...restFormikProps}
          />
          <NavigationContainer fixed>
            <BackButton id="backBtn" type="button" onClick={() => history.push(`/section/${page.section}`)}>
              <FormattedMessage {...messages.back} />
            </BackButton>
            <NextButton
              id="savePage"
              type="submit"
              loading={updateLoading}
              disabled={!isValid || !dirty || updateLoading}
            >
              <FormattedMessage {...messages.create} />
            </NextButton>
          </NavigationContainer>
        </form>
      </LoadingWrapper>
      <Modal ariaHideApp={false} isOpen={removeModalOpen} contentLabel="Confirm Removal" style={modalStyles}>
        <ModalTitle>
          <FormattedMessage {...messages.removeTitle} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={() => setRemoveModalOpen(false)} disabled={removeLoading}>
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
    </Container>
  );
};

Page.propTypes = {
  pageTemplates: PropTypes.array.isRequired,
  userRole: PropTypes.string.isRequired,
  updatePage: PropTypes.func.isRequired,
  fetchPageTemplates: PropTypes.func.isRequired,
  fetchPage: PropTypes.func.isRequired,
  removePage: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
};
