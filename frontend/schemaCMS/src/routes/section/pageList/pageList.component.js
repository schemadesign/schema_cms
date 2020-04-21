import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';
import { useFormik } from 'formik';
import { pick, propEq, propOr, pipe, find } from 'ramda';
import { Form as FormUI, Icons } from 'schemaUI';

import { Container, Form, getCustomHomeIconStyles } from './pageList.styles';
import messages from './pageList.messages';
import { getProjectMenuOptions, PROJECT_CONTENT_ID } from '../../project/project.constants';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import {
  BackArrowButton,
  BackButton,
  NavigationContainer,
  NextButton,
  PlusButton,
} from '../../../shared/components/navigation';
import { CounterHeader } from '../../../shared/components/counterHeader';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { CardHeader } from '../../../shared/components/cardHeader';
import {
  SECTIONS_MAIN_PAGE,
  SECTIONS_NAME,
  SECTIONS_PUBLISH,
  SECTIONS_SCHEMA,
} from '../../../modules/sections/sections.constants';
import {
  AvailableCopy,
  BinIconContainer,
  binStyles,
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
import { PAGE_DISPLAY_NAME } from '../../../modules/page/page.constants';

const { EditIcon, MinusIcon, HomeIcon } = Icons;
const { Switch } = FormUI;

export const Page = ({ created, createdBy, name, id, templateName, mainPage, setFieldValue, index }) => {
  const history = useHistory();
  const intl = useIntl();
  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const list = [whenCreated, createdBy];
  const active = mainPage === id;
  const setMainPage = () => setFieldValue(SECTIONS_MAIN_PAGE, active ? null : id);

  const header = (
    <CardHeader
      list={list}
      icon={
        <HomeIcon id={`homeIcon-${index}`} customStyles={getCustomHomeIconStyles({ active })} onClick={setMainPage} />
      }
    />
  );

  return (
    <ListItem headerComponent={header} footerComponent={templateName || intl.formatMessage(messages.blankTemplate)}>
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
  id: PropTypes.number.isRequired,
  templateName: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  mainPage: PropTypes.number,
  index: PropTypes.number.isRequired,
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
  project: { id: projectId, title: projectTitle, domain },
  removeSection,
  updateSection,
  userRole,
}) => {
  const { pages = [], mainPage } = section;
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
  )(pages);
  const pageUrl = `${domain}${displayName ? `/${displayName}` : ''}`;
  const visitPage = domain ? (
    <Fragment>
      <CopySeparator />
      <FormattedMessage {...messages.visitPage} values={{ page: <a href={pageUrl}>{pageUrl}</a> }} />
    </Fragment>
  ) : null;
  const { handleSubmit, handleChange, values, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: pick([SECTIONS_NAME, SECTIONS_PUBLISH, SECTIONS_MAIN_PAGE], section),
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
        <CounterHeader
          moveToTop
          copy={intl.formatMessage(messages.page)}
          count={pages.length}
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
          {pages.map((page, index) => (
            <Page
              key={index}
              index={index}
              mainPage={values[SECTIONS_MAIN_PAGE]}
              setFieldValue={restFormikProps.setFieldValue}
              {...page}
            />
          ))}
        </ListContainer>
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
              <MinusIcon customStyles={binStyles} />
            </BinIconContainer>
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
  section: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};
