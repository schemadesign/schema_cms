import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import Helmet from 'react-helmet';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import { pick } from 'ramda';
import { Form as FormUI, Icons } from 'schemaUI';

import { Container, Form, CopySeparator } from './pageList.styles';
import messages from './pageList.messages';
import { getProjectMenuOptions, PROJECT_CONTENT_ID } from '../../project/project.constants';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { CONTENT } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import {
  BackArrowButton,
  BackButton,
  NavigationContainer,
  NextButton,
  PlusButton,
} from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { CounterHeader } from '../../../shared/components/counterHeader';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { CardHeader } from '../../../shared/components/cardHeader';
import { SECTIONS_NAME, SECTIONS_PUBLISH, SECTIONS_SCHEMA } from '../../../modules/sections/sections.constants';
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
} from '../../../shared/components/form/frequentComponents.styles';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../../../shared/components/modal/modal.styles';

const { EditIcon, MinusIcon } = Icons;
const { Switch } = FormUI;
const TEMPORARY_PAGE_URL = 'https://scehmacms.com';

const Page = ({ created, createdBy, name, id, pageTemplate }) => {
  const history = useHistory();
  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const list = [whenCreated, createdBy];
  const header = <CardHeader list={list} />;

  return (
    <ListItem headerComponent={header} footerComponent={pageTemplate}>
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
  pageTemplate: PropTypes.string.isRequired,
};

export const PageList = ({
  section,
  project: { id: projectId },
  fetchSection,
  removeSection,
  updateSection,
  userRole,
}) => {
  const { pages = [], slug = '', pagesCount = 0 } = section;
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState(null);
  const { sectionId } = useParams();
  const history = useHistory();
  const intl = useIntl();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);
  const visitPage = `${TEMPORARY_PAGE_URL}/${slug}`;
  const { handleSubmit, handleChange, values, isValid, dirty, ...restFormikProps } = useFormik({
    initialValues: pick([SECTIONS_NAME, SECTIONS_PUBLISH], section),
    enableReinitialize: true,
    validationSchema: () => SECTIONS_SCHEMA,
    onSubmit: async formData => {
      try {
        setUpdateLoading(true);
        await updateSection({ formData, sectionId });
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

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchSection({ sectionId });
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
      <MobileMenu
        headerTitle={title}
        headerSubtitle={subtitle}
        options={filterMenuOptions(menuOptions, userRole)}
        active={PROJECT_CONTENT_ID}
      />
      <ProjectTabs active={CONTENT} url={`/project/${projectId}`} />
      <LoadingWrapper loading={loading} error={error}>
        <Form onSubmit={handleSubmit}>
          <ContextHeader title={title} subtitle={nameInput}>
            <PlusButton id="createPage" onClick={() => history.push(`/section/${sectionId}/create-page`)} />
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
            copy={intl.formatMessage(messages.page)}
            count={pagesCount}
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
              <Page key={index} {...page} />
            ))}
          </ListContainer>
          <Switches>
            <SwitchContainer>
              <SwitchContent>
                <Switch value={values[SECTIONS_PUBLISH]} id={SECTIONS_PUBLISH} onChange={handleChange} />
                <SwitchCopy isLink>
                  <SwitchLabel htmlFor={SECTIONS_PUBLISH}>
                    <FormattedMessage {...messages[SECTIONS_PUBLISH]} />
                  </SwitchLabel>
                  <AvailableCopy>
                    <FormattedMessage
                      {...messages.availableForEditors}
                      values={{
                        availability: intl.formatMessage(
                          messages[values[SECTIONS_PUBLISH] ? 'publicCopy' : 'privateCopy']
                        ),
                      }}
                    />
                    <CopySeparator />
                    <FormattedMessage {...messages.visitPage} values={{ page: <a href={visitPage}>{visitPage}</a> }} />
                  </AvailableCopy>
                </SwitchCopy>
              </SwitchContent>
              <BinIconContainer id="removeSection" onClick={() => setRemoveModalOpen(true)}>
                <MinusIcon customStyles={binStyles} />
              </BinIconContainer>
            </SwitchContainer>
          </Switches>
          <NavigationContainer fixed>
            <BackArrowButton id="backBtn" onClick={() => history.push(`/project/${projectId}/content`)} />
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

PageList.propTypes = {
  userRole: PropTypes.string.isRequired,
  fetchSection: PropTypes.func.isRequired,
  updateSection: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  section: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};
