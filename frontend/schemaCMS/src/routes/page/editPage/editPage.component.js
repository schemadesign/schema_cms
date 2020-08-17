import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffectOnce } from 'react-use';
import { useHistory, useParams, useLocation, Prompt } from 'react-router';
import { useFormik } from 'formik';
import Helmet from 'react-helmet';
import { isEmpty, pick, pathOr, defaultTo } from 'ramda';

import { Container } from './editPage.styles';
import messages from './editPage.messages';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import {
  errorMessageParser,
  filterMenuOptions,
  prepareForPostingPageData,
  prepareTags,
} from '../../../shared/utils/helpers';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { PageForm } from '../../../shared/components/pageForm';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { getProjectMenuOptions } from '../../project/project.constants';
import {
  PAGE_SCHEMA,
  FORM_VALUES,
  PAGE_TEMPLATE,
  PAGE_BLOCKS,
  PAGE_NAME,
  INITIAL_VALUES,
  PAGE_DISPLAY_NAME,
  PAGE_TAGS,
} from '../../../modules/page/page.constants';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import {
  contentMessage,
  pageMessage,
  ProjectBreadcrumbs,
  projectMessage,
  sectionMessage,
  tabMessage,
} from '../../../shared/components/projectBreadcrumbs';

const getBreadcrumbsItems = (project, section, page) => [
  {
    path: `/project/${project.id}/`,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/content`,
    span: tabMessage,
    h3: contentMessage,
  },
  {
    path: `/section/${section.id}`,
    span: sectionMessage,
    h3: section.name,
  },
  {
    path: `/page/${page.id}`,
    active: true,
    span: pageMessage,
    h3: page.name,
  },
];

export const EditPage = ({
  project,
  updatePage,
  page,
  userRole,
  removePage,
  fetchPageAdditionalData,
  pageAdditionalData,
  copyPage,
  publishPage,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [leavingPageModalOpen, setLeavingPageModalOpen] = useState(false);
  const [leavingPageLoading, setLeavingPageLoading] = useState(false);
  const [customLocation, setCustomLocation] = useState(false);
  const { pageId } = useParams();
  const history = useHistory();
  const { state = {} } = useLocation();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const projectId = project.id;
  const menuOptions = getProjectMenuOptions(projectId);
  const initialValues = {
    ...INITIAL_VALUES,
    ...pick(FORM_VALUES, page),
    [PAGE_TAGS]: prepareTags(page[PAGE_TAGS]),
    [PAGE_TEMPLATE]: defaultTo(0, page[PAGE_TEMPLATE]),
  };
  const mainPage = pathOr({}, ['section', 'mainPage'], page);
  const pathName =
    mainPage[PAGE_DISPLAY_NAME] && mainPage.id !== page.id
      ? `/${mainPage[PAGE_DISPLAY_NAME]}/${page[PAGE_DISPLAY_NAME]}`
      : `/${page[PAGE_DISPLAY_NAME]}`;
  const { domain } = project;
  const pageUrl = domain ? `${domain}${pathName}` : null;

  const { handleSubmit, isValid, dirty, values, setValues, setFieldValue, ...restFormikProps } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: () => PAGE_SCHEMA,
    onSubmit: async (data, { setErrors }) => {
      try {
        setUpdateLoading(true);
        const formData = prepareForPostingPageData(data);

        await updatePage({ formData, pageId });
      } catch (errors) {
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
        reportError(errors);
      } finally {
        setUpdateLoading(false);
      }
    },
  });
  const handleConfirmRemove = async () => {
    try {
      setRemoveLoading(true);
      await removePage({ pageId });
      history.push(`/section/${page.section.id}`);
    } catch (e) {
      reportError(e);
      setRemoveLoading(false);
    }
  };
  const handleConfirmPublish = async () => {
    try {
      setPublishLoading(true);
      await publishPage({ pageId });
      setPublishModalOpen(false);
      setPublishLoading(false);
    } catch (e) {
      reportError(e);
      setPublishLoading(false);
    }
  };

  const handleConfirmLeavePage = async () => {
    try {
      setPublishLoading(true);
      history.push(customLocation);
    } catch (e) {
      reportError(e);
      setPublishLoading(false);
    }
  };

  const handlePromptMessage = location => {
    if (!customLocation) {
      setCustomLocation(location);
      setLeavingPageModalOpen(true);
      return false;
    }
  };

  const handleBackButtonClick = () => {
    setLeavingPageModalOpen(false);
    setCustomLocation(false);
  };

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchPageAdditionalData({ projectId });

        const { page = {} } = state;

        if (!isEmpty(page)) {
          if (page[PAGE_NAME]) {
            setValues(page);
          } else {
            setFieldValue(PAGE_BLOCKS, values[PAGE_BLOCKS].concat(page[PAGE_BLOCKS]));
          }
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

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <ProjectBreadcrumbs items={getBreadcrumbsItems(project, page.section, page)} />
      <LoadingWrapper loading={loading} error={error}>
        <form onSubmit={handleSubmit}>
          <PageForm
            pageUrl={pageUrl}
            domain={project.domain}
            pageId={page.id}
            title={title}
            isValid={isValid}
            dirty={dirty}
            copyPage={copyPage}
            setRemoveModalOpen={setRemoveModalOpen}
            values={values}
            setValues={setValues}
            {...pageAdditionalData}
            setFieldValue={setFieldValue}
            {...restFormikProps}
          />
          <NavigationContainer fixed>
            <BackButton id="backBtn" type="button" onClick={() => history.push(`/section/${page.section.id}`)}>
              <FormattedMessage {...messages.back} />
            </BackButton>
            <NextButton
              id="publishPage"
              type="button"
              loading={publishLoading}
              disabled={!page.isChanged}
              onClick={() => setPublishModalOpen(true)}
            >
              <FormattedMessage {...messages.publish} />
            </NextButton>
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
      <Modal
        ariaHideApp={false}
        isOpen={removeModalOpen}
        contentLabel={intl.formatMessage(messages.confirmRemovalMessage)}
        style={modalStyles}
      >
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
      <Modal
        ariaHideApp={false}
        isOpen={publishModalOpen}
        contentLabel={intl.formatMessage(messages.confirmPublishing)}
        style={modalStyles}
      >
        <ModalTitle>
          <FormattedMessage {...messages.publishTitle} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={() => setPublishModalOpen(false)} disabled={publishLoading}>
            <FormattedMessage {...messages.cancelPublish} />
          </BackButton>
          <NextButton
            id="confirmPublishBtn"
            onClick={handleConfirmPublish}
            loading={publishLoading}
            disabled={publishLoading}
          >
            <FormattedMessage {...messages.confirmPublish} />
          </NextButton>
        </ModalActions>
      </Modal>
      <Modal
        ariaHideApp={false}
        isOpen={leavingPageModalOpen}
        contentLabel={intl.formatMessage(messages.confirmLeavingPage)}
        style={modalStyles}
      >
        <ModalTitle>
          <FormattedMessage {...messages.leavingPageTitle} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={handleBackButtonClick} disabled={leavingPageLoading}>
            <FormattedMessage {...messages.cancelLeavePage} />
          </BackButton>
          <NextButton
            id="confirmLeavingPageBtn"
            onClick={handleConfirmLeavePage}
            loading={leavingPageLoading}
            disabled={leavingPageLoading}
          >
            <FormattedMessage {...messages.confirmPublish} />
          </NextButton>
        </ModalActions>
      </Modal>
      <Prompt when={dirty} message={location => handlePromptMessage(location)} />
    </Container>
  );
};

EditPage.propTypes = {
  userRole: PropTypes.string.isRequired,
  updatePage: PropTypes.func.isRequired,
  removePage: PropTypes.func.isRequired,
  publishPage: PropTypes.func.isRequired,
  copyPage: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  fetchPageAdditionalData: PropTypes.func.isRequired,
  pageAdditionalData: PropTypes.object.isRequired,
};
