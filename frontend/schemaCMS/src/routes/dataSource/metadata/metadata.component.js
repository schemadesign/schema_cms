import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useHistory, useRouteMatch } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import { remove } from 'ramda';
import { Accordion, AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useTheme } from 'styled-components';

import {
  Container,
  editIconStyles,
  Form,
  getCustomInputStyles,
  Header,
  IconsContainer,
  InputContainer,
  inputContainerStyles,
} from './metadata.styles';
import messages from './metadata.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { getProjectMenuOptions } from '../../project/project.constants';
import reportError from '../../../shared/utils/reportError';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import {
  INITIAL_VALUES,
  METADATA,
  METADATA_KEY,
  METADATA_SCHEMA,
  METADATA_VALUE,
} from '../../../modules/metadata/metadata.constants';
import { CounterHeader } from '../../../shared/components/counterHeader';
import { binStyles, mobilePlusStyles, PlusContainer } from '../../../shared/components/form/frequentComponents.styles';
import { NavigationContainer, NextButton, PlusButton } from '../../../shared/components/navigation';
import { TextInput } from '../../../shared/components/form/inputs/textInput';

const { EditIcon, BinIcon } = Icons;

export const Metadata = ({ dataSource, userRole, project, fetchMetadata, updateMetadata }) => {
  const intl = useIntl();
  const history = useHistory();
  const match = useRouteMatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const headerTitle = dataSource.name;
  const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
  const menuOptions = getProjectMenuOptions(project.id);
  const metadataCopy = intl.formatMessage(messages.metadata);
  const inputStyles = getCustomInputStyles(useTheme());
  const {
    values,
    setFieldValue,
    handleChange,
    handleSubmit,
    isSubmitting,
    dirty,
    isValid,
    ...restFormikProps
  } = useFormik({
    initialValues: INITIAL_VALUES,
    enableReinitialize: true,
    validationSchema: () => METADATA_SCHEMA,
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      try {
        await updateMetadata({ dataSourceId: dataSource.id, formData: data[METADATA] });
        setSubmitting(false);
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      }
    },
  });
  const addMetadata = () => setFieldValue(METADATA, [...values[METADATA], { key: '', value: '' }]);
  const removeMetadata = index => setFieldValue(METADATA, remove(index, 1, values[METADATA]));

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchMetadata({ projectId: project.id, type: 'dataset' });
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
      <Helmet title={intl.formatMessage(messages.pageTitle)} />
      <MobileMenu
        headerTitle={headerTitle}
        headerSubtitle={headerSubtitle}
        options={filterMenuOptions(menuOptions, userRole)}
      />
      <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
        <DataSourceNavigation history={history} match={match} dataSource={dataSource} />
      </ContextHeader>
      <LoadingWrapper loading={loading} error={error}>
        <CounterHeader
          count={values[METADATA].length}
          copy={metadataCopy}
          customPlural={metadataCopy}
          right={
            <PlusContainer>
              <PlusButton customStyles={mobilePlusStyles} onClick={addMetadata} type="button" disabled={!isValid} />
            </PlusContainer>
          }
        />
        <Form>
          <Accordion>
            {values[METADATA].map(({ key, value }, index) => (
              <AccordionPanel key={index} autoOpen>
                <AccordionHeader>
                  <Header>
                    <TextInput
                      name={`${METADATA}.${index}.${METADATA_KEY}`}
                      placeholder={intl.formatMessage(messages[`${METADATA_KEY}Placeholder`])}
                      onChange={handleChange}
                      autoWidth
                      fullWidth
                      value={key}
                      {...restFormikProps}
                    />
                    <IconsContainer>
                      <EditIcon />
                      <BinIcon customStyles={binStyles} onClick={() => removeMetadata(index)} />
                    </IconsContainer>
                  </Header>
                </AccordionHeader>
                <AccordionDetails>
                  <InputContainer>
                    <TextInput
                      name={`${METADATA}.${index}.${METADATA_VALUE}`}
                      value={value}
                      fullWidth
                      customStyles={inputContainerStyles}
                      customInputStyles={inputStyles}
                      onChange={handleChange}
                      multiline
                      {...restFormikProps}
                    />
                    <EditIcon customStyles={editIconStyles} />
                  </InputContainer>
                </AccordionDetails>
              </AccordionPanel>
            ))}
          </Accordion>
          <NavigationContainer right fixed padding="10px 0 70px">
            <NextButton onClick={handleSubmit} loading={isSubmitting} disabled={!isValid || !dirty || isSubmitting}>
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </LoadingWrapper>
    </Container>
  );
};

Metadata.propTypes = {
  dataSource: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  fetchMetadata: PropTypes.func.isRequired,
  updateMetadata: PropTypes.func.isRequired,
};
