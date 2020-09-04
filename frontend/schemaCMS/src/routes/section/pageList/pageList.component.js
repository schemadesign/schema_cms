import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';
import { useFormik } from 'formik';
import { pick, propEq, propOr, pipe, find } from 'ramda';
import { Form as FormUI, Icons } from 'schemaUI';
import { useEffectOnce } from 'react-use';
import { parse, stringify } from 'query-string';
import ReactPaginate from 'react-paginate';

import { Container, Form, getCustomHomeIconStyles, CardFooter, Pagination, CardHeaderIcons } from './pageList.styles';
import messages from './pageList.messages';
import { getProjectMenuOptions, PROJECT_CONTENT_ID } from '../../project/project.constants';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions, getUrlParams } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import {
  BackArrowButton,
  BackButton,
  NavigationContainer,
  NextButton,
  PlusButton,
} from '../../../shared/components/navigation';
import { CounterHeader } from '../../../shared/components/counterHeader';
import { ListContainer, ListItem, ListItemTitle, FooterContainer } from '../../../shared/components/listComponents';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { CardHeader } from '../../../shared/components/cardHeader';
import {
  SECTIONS_MAIN_PAGE,
  SECTIONS_NAME,
  SECTIONS_PUBLISH,
  SECTIONS_RSS,
  SECTIONS_SCHEMA,
} from '../../../modules/sections/sections.constants';
import {
  AvailableCopy,
  BinIconContainer,
  IconsContainer,
  inputContainerStyles,
  inputStyles,
  MobileInputName,
  MobilePlusContainer,
  mobilePlusStyles,
  Subtitle,
  SwitchContainer,
  SwitchContent,
  SwitchCopy,
  Switches,
  SwitchLabel,
  CopySeparator,
  Draft,
} from '../../../shared/components/form/frequentComponents.styles';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';
import {
  ProjectBreadcrumbs,
  projectMessage,
  tabMessage,
  contentMessage,
  sectionMessage,
} from '../../../shared/components/projectBreadcrumbs';
import { PAGE_DISPLAY_NAME, PAGE_NAME } from '../../../modules/page/page.constants';
import { SortingSelect } from '../../../shared/components/form/sortingSelect/sortingSelect.component';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { INITIAL_PAGE_SIZE } from '../../../shared/utils/api.constants';
import { renderWhenTrue } from '../../../shared/utils/rendering';
import { CopyButton } from '../../../shared/components/copyButton';

const { EditIcon, BinIcon, HomeIcon } = Icons;
const { Switch } = FormUI;

export const Page = ({
  created,
  sectionId,
  copyPage,
  createdBy,
  name,
  isChanged,
  id,
  templateName,
  mainPage,
  setFieldValue,
  index,
}) => {
  const history = useHistory();
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const list = [whenCreated, createdBy];
  const active = mainPage === id;
  const setMainPage = () => setFieldValue(SECTIONS_MAIN_PAGE, active ? null : id);
  const templateCopy = templateName || intl.formatMessage(messages.blankTemplate);

  const copyPageAction = async () => {
    try {
      setLoading(true);
      await copyPage({ pageId: id, sectionId });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderDraft = renderWhenTrue(() => (
    <Draft>
      <FormattedMessage {...messages.draft} />
    </Draft>
  ));

  const header = (
    <CardHeader
      list={list}
      icon={
        <CardHeaderIcons>
          <HomeIcon id={`homeIcon-${index}`} customStyles={getCustomHomeIconStyles({ active })} onClick={setMainPage} />
          <CopyButton name={`pageCopyButton-${index}`} loading={loading} error={error} action={copyPageAction} />
        </CardHeaderIcons>
      }
    />
  );

  const renderFooterComponent = () => (
    <FooterContainer>
      <CardFooter title={templateCopy}>{templateCopy}</CardFooter>
      {renderDraft(isChanged)}
    </FooterContainer>
  );

  return (
    <ListItem headerComponent={header} footerComponent={renderFooterComponent()}>
      <ListItemTitle id={`page-${id}`} onClick={() => history.push(`/page/${id}`)}>
        {name}
      </ListItemTitle>
    </ListItem>
  );
};

Page.propTypes = {
  created: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isChanged: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  templateName: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  copyPage: PropTypes.func.isRequired,
  mainPage: PropTypes.number,
  index: PropTypes.number.isRequired,
  sectionId: PropTypes.string.isRequired,
};

const getBreadcrumbsItems = (project, { id, name }) => [
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
    path: `/section/${id}`,
    span: sectionMessage,
    active: true,
    h3: name,
  },
];

export const PageList = ({
  section,
  pages,
  project: { id: projectId, title: projectTitle, domain },
  removeSection,
  updateSection,
  fetchSection,
  fetchPages,
  userRole,
  copyPage,
}) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const { mainPage } = section;
  const [updateLoading, setUpdateLoading] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const { sectionId } = useParams();
  const history = useHistory();
  const intl = useIntl();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);
  const displayName = pipe(
    find(propEq('id', mainPage)),
    propOr('', PAGE_DISPLAY_NAME)
  )(pages.results);
  const pageUrl = `${domain}${displayName ? `/${displayName}` : ''}`;
  const visitPage = domain ? (
    <Fragment>
      <CopySeparator />
      <FormattedMessage {...messages.visitPage} values={{ page: <a href={pageUrl}>{pageUrl}</a> }} />
    </Fragment>
  ) : null;
  const { handleSubmit, handleChange, values, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: pick([SECTIONS_NAME, SECTIONS_PUBLISH, SECTIONS_MAIN_PAGE, SECTIONS_RSS], section),
    enableReinitialize: true,
    validationSchema: () => SECTIONS_SCHEMA,
    onSubmit: async (formData, { setErrors }) => {
      try {
        setUpdateLoading(true);
        await updateSection({ formData, sectionId });
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

  const pageCount = pages.count / INITIAL_PAGE_SIZE;

  const fetchSectionFunc = async () => {
    try {
      const urlParams = getUrlParams(history);
      setLoading(true);
      await fetchPages({ sectionId, ...urlParams });
      setLoading(false);
    } catch (e) {
      reportError(e);
      setError(e);
    }
  };

  useEffectOnce(() => {
    fetchSection({ sectionId });
    fetchSectionFunc();
  });

  const handleConfirmRemove = async () => {
    try {
      setRemoveLoading(true);
      await removeSection({ sectionId });
      history.push(`/project/${projectId}/content`);
    } catch (e) {
      reportError(e);
      setRemoveLoading(false);
    }
  };

  const handlePageChange = ({ selected: page }) => {
    const urlParams = { ...parse(history.location.search), page: page + 1 };
    setPage(page);
    history.push(`?${stringify(urlParams)}`);
    fetchSectionFunc();
  };

  const renderPagination = renderWhenTrue(() => (
    <Pagination>
      <ReactPaginate
        pageCount={Math.ceil(pageCount)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        forcePage={page}
        disabledClassName={'disabled'}
      />
    </Pagination>
  ));

  const nameInput = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name={SECTIONS_NAME}
        value={values[SECTIONS_NAME]}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        placeholder={intl.formatMessage(messages[`${SECTIONS_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu
        headerTitle={title}
        headerSubtitle={subtitle}
        options={filterMenuOptions(menuOptions, userRole)}
        active={PROJECT_CONTENT_ID}
      />
      <ProjectBreadcrumbs items={getBreadcrumbsItems({ id: projectId, title: projectTitle }, section)} />
      <Form onSubmit={handleSubmit}>
        <ContextHeader title={title} subtitle={nameInput}>
          <PlusButton id="createPage" type="button" onClick={() => history.push(`/section/${sectionId}/create-page`)} />
        </ContextHeader>
        <MobileInputName>
          <TextInput
            onChange={handleChange}
            name={SECTIONS_NAME}
            value={values[SECTIONS_NAME]}
            label={<FormattedMessage {...messages[SECTIONS_NAME]} />}
            fullWidth
            isEdit
            {...restFormikProps}
          />
        </MobileInputName>
        <SortingSelect updateFunction={fetchSectionFunc} sortingElements={[PAGE_NAME]} addDateOptions />
        <LoadingWrapper loading={loading} error={error}>
          <CounterHeader
            copy={intl.formatMessage(messages.page)}
            count={pages.results.length}
            right={
              <MobilePlusContainer>
                <PlusButton
                  customStyles={mobilePlusStyles}
                  id="createPageMobile"
                  onClick={() => history.push(`/section/${sectionId}/create-page`)}
                  type="button"
                />
              </MobilePlusContainer>
            }
          />
          <ListContainer>
            {pages.results.map((page, index) => (
              <Page
                key={index}
                index={index}
                mainPage={values[SECTIONS_MAIN_PAGE]}
                sectionId={sectionId}
                copyPage={copyPage}
                setFieldValue={restFormikProps.setFieldValue}
                {...page}
              />
            ))}
          </ListContainer>
          {renderPagination(pageCount > 1)}
          <Switches>
            <SwitchContainer>
              <SwitchContent>
                <Switch value={values[SECTIONS_PUBLISH]} id={SECTIONS_PUBLISH} onChange={handleChange} />
                <SwitchCopy>
                  <SwitchLabel htmlFor={SECTIONS_PUBLISH}>
                    <FormattedMessage {...messages[SECTIONS_PUBLISH]} />
                  </SwitchLabel>
                  <AvailableCopy>
                    <FormattedMessage
                      {...messages.sectionAvailability}
                      values={{
                        availability: intl.formatMessage(
                          messages[values[SECTIONS_PUBLISH] ? 'publicCopy' : 'privateCopy']
                        ),
                      }}
                    />
                    {visitPage}
                  </AvailableCopy>
                </SwitchCopy>
              </SwitchContent>
              <BinIconContainer id="removeSection" onClick={() => setRemoveModalOpen(true)}>
                <BinIcon />
              </BinIconContainer>
            </SwitchContainer>
            <SwitchContainer>
              <SwitchContent>
                <Switch value={values[SECTIONS_RSS]} id={SECTIONS_RSS} onChange={handleChange} />
                <SwitchCopy>
                  <SwitchLabel htmlFor={SECTIONS_RSS}>
                    <FormattedMessage {...messages[SECTIONS_RSS]} />
                  </SwitchLabel>
                  <AvailableCopy>
                    <FormattedMessage
                      {...messages.sectionRssEnabled}
                      values={{
                        availability: intl.formatMessage(messages[values[SECTIONS_RSS] ? 'enabledRss' : 'disabledRss']),
                      }}
                    />
                    {visitPage}
                  </AvailableCopy>
                </SwitchCopy>
              </SwitchContent>
            </SwitchContainer>
          </Switches>
          <NavigationContainer fixed>
            <BackArrowButton id="backBtn" type="button" onClick={() => history.push(`/project/${projectId}/content`)} />
            <NextButton
              id="updateSection"
              type="submit"
              loading={updateLoading}
              disabled={!isValid || !dirty || updateLoading}
            >
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </LoadingWrapper>
      </Form>
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

PageList.propTypes = {
  userRole: PropTypes.string.isRequired,
  updateSection: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  fetchSection: PropTypes.func.isRequired,
  fetchPages: PropTypes.func.isRequired,
  copyPage: PropTypes.func.isRequired,
  section: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};
