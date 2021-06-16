import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useHistory, useRouteMatch } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useFormik, yupToFormErrors, validateYupSchema } from 'formik';
import { remove, map, pick } from 'ramda';
import { Accordion, AccordionDetails, AccordionHeader, AccordionPanel, Icons, Typography } from 'schemaUI';
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
  TitleWrapper,
} from './metadata.styles';
import messages from './metadata.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { errorMessageParser, filterMenuOptions, getPropsWhenNotEmpty } from '../../../shared/utils/helpers';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { getProjectMenuOptions } from '../../project/project.constants';
import reportError from '../../../shared/utils/reportError';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { METADATA, METADATA_KEY, METADATA_SCHEMA, METADATA_VALUE } from '../../../modules/metadata/metadata.constants';
import { CounterHeader } from '../../../shared/components/counterHeader';
import {
  binStyles,
  EditIconLabel,
  mobilePlusStyles,
  PlusContainer,
} from '../../../shared/components/form/frequentComponents.styles';
import { NavigationContainer, NextButton, PlusButton } from '../../../shared/components/navigation';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { DataSourceLabeling } from '../../../shared/components/dataSourceLabeling';
import { renderWhenTrue } from '../../../shared/utils/rendering';

const { EditIcon, BinIcon } = Icons;
const { H1 } = Typography;

export const Metadata = ({
  dataSource,
  userRole,
  project,
  fetchMetadata,
  updateMetadata,
  metadata,
  previewData,
  fetchPreview,
}) => {
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
    resetForm,
    ...restFormikProps
  } = useFormik({
    initialValues: { [METADATA]: metadata },
    enableReinitialize: true,
    validate: values => {
      try {
        validateYupSchema(values, METADATA_SCHEMA, true, values);
      } catch (err) {
        return yupToFormErrors(err);
      }

      return {};
    },
    onSubmit: async (data, { setSubmitting, setErrors }) => {
      try {
        await updateMetadata({ dataSourceId: dataSource.id, formData: data });
        resetForm({ values });
        setSubmitting(false);
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      }
    },
  });
  const addMetadata = () => setFieldValue(METADATA, [...values[METADATA], { key: '', value: '', id: Date.now() }]);
  const removeMetadata = index => setFieldValue(METADATA, remove(index, 1, values[METADATA]));

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchMetadata({ dataSourceId: dataSource.id });
        await fetchPreview({ dataSourceId: dataSource.id, jobId: dataSource.activeJob.id });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  const accordionCopyProps = getPropsWhenNotEmpty(values[METADATA], {
    collapseCopy: intl.formatMessage(messages.collapseCopy),
    expandCopy: intl.formatMessage(messages.expandCopy),
  });

  const handleOnSelect = mappedValues => {
    setFieldValue('labels', map(pick(['type', 'param']))(mappedValues));
  };

  const renderMetadataTitle = renderWhenTrue(() => (
    <TitleWrapper>
      <H1>
        <FormattedMessage {...messages.metaDataTitle} />
      </H1>
    </TitleWrapper>
  ));

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
          {renderMetadataTitle(!!values[METADATA].length)}
          <Accordion {...accordionCopyProps} newOpen>
            {values[METADATA].map(({ key, value, id }, index) => (
              <AccordionPanel key={id} id={id}>
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
                      <EditIconLabel htmlFor={`${METADATA}.${index}.${METADATA_KEY}`}>
                        <EditIcon />
                      </EditIconLabel>
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
                    <EditIconLabel htmlFor={`${METADATA}.${index}.${METADATA_VALUE}`}>
                      <EditIcon customStyles={editIconStyles} />
                    </EditIconLabel>
                  </InputContainer>
                </AccordionDetails>
              </AccordionPanel>
            ))}
          </Accordion>
          <TitleWrapper>
            <H1>
              <FormattedMessage {...messages.mappingLabelsTitle} />
            </H1>
          </TitleWrapper>
          <DataSourceLabeling dataSource={previewData} onSelect={handleOnSelect} />
          <NavigationContainer right fixed padding="10px 0 70px">
            <NextButton onClick={handleSubmit} loading={isSubmitting} disabled={!isValid || !dirty || isSubmitting}>
              <FormattedMessage {...messages.save} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </LoadingWrapper>
      <DataSourceNavigation hideOnDesktop history={history} match={match} dataSource={dataSource} />
    </Container>
  );
};

Metadata.propTypes = {
  dataSource: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
  fetchMetadata: PropTypes.func.isRequired,
  updateMetadata: PropTypes.func.isRequired,
  metadata: PropTypes.array.isRequired,
  previewData: PropTypes.object.isRequired,
  fetchPreview: PropTypes.func.isRequired,
};
