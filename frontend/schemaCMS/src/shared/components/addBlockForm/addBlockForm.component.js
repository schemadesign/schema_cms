import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import { Icons } from 'schemaUI';
import { propEq, find, map } from 'ramda';

import { NoBlocksCopyContainer, SelectContainer } from './addBlockForm.styles';
import { LoadingWrapper } from '../loadingWrapper';
import reportError from '../../utils/reportError';
import { BackButton, NavigationContainer, NextButton } from '../navigation';
import messages from './addBlockForm.messages';
import { ContextHeader } from '../contextHeader';
import {
  IconsContainer,
  inputContainerStyles,
  inputStyles,
  MobileInputName,
  Subtitle,
} from '../form/frequentComponents.styles';
import { TextInput } from '../form/inputs/textInput';
import {
  ADD_BLOCK_SCHEMA,
  BLOCK_NAME,
  BLOCK_TYPE,
  INITIAL_VALUES_ADD_BLOCK,
} from '../../../modules/page/page.constants';
import { Select } from '../form/select';

const { EditIcon } = Icons;

export const AddBlockForm = ({
  fetchBlockTemplates,
  updateTemporaryPageBlocks,
  projectId,
  backUrl,
  title,
  blockTemplates,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  const intl = useIntl();
  const { state = {} } = useLocation();
  const blocksOptions = map(({ name, id }) => ({ label: name, value: id }), blockTemplates);
  const { handleSubmit, handleChange, values, isValid, dirty, setFieldValue, ...restFormikProps } = useFormik({
    initialValues: INITIAL_VALUES_ADD_BLOCK,
    enableReinitialize: true,
    validationSchema: () => ADD_BLOCK_SCHEMA,
    onSubmit: ({ name, type }) => {
      try {
        const blockTemplate = find(propEq('id', type), blockTemplates);
        const { name: blockName, id, ...rest } = blockTemplate;

        updateTemporaryPageBlocks({ ...rest, name, key: Date.now(), type: blockName, block: id });
        history.push(backUrl, { fromAddBlock: true, emptyBlocks: state.emptyBlocks });
      } catch (errors) {
        reportError(errors);
      }
    },
  });
  const nameInput = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name={BLOCK_NAME}
        value={values[BLOCK_NAME]}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        placeholder={intl.formatMessage(messages[`${BLOCK_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );
  const handleSelectType = ({ value }) => {
    setFieldValue(BLOCK_TYPE, value);
  };

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchBlockTemplates({ projectId, content: true });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });
  return (
    <LoadingWrapper loading={loading} error={error}>
      <form onSubmit={handleSubmit}>
        <ContextHeader title={title} subtitle={nameInput} />
        <MobileInputName>
          <TextInput
            onChange={handleChange}
            name={BLOCK_NAME}
            value={values[BLOCK_NAME]}
            label={<FormattedMessage {...messages[BLOCK_NAME]} />}
            fullWidth
            isEdit
            {...restFormikProps}
          />
        </MobileInputName>
        <SelectContainer>
          {blocksOptions.length ? (
            <Select
              label={intl.formatMessage(messages[BLOCK_TYPE])}
              name={BLOCK_TYPE}
              value={values[BLOCK_TYPE]}
              id="blockTypeSelect"
              options={blocksOptions}
              onSelect={handleSelectType}
              placeholder={intl.formatMessage(messages[`${BLOCK_TYPE}Placeholder`])}
              {...restFormikProps}
            />
          ) : (
            <NoBlocksCopyContainer>
              <FormattedMessage {...messages.noBlocks} />
            </NoBlocksCopyContainer>
          )}
        </SelectContainer>
        <NavigationContainer fixed>
          <BackButton id="backBtn" type="button" onClick={() => history.push(backUrl, { fromAddBlock: true })}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          <NextButton id="addBlock" type="submit" disabled={!isValid || !dirty}>
            <FormattedMessage {...messages.add} />
          </NextButton>
        </NavigationContainer>
      </form>
    </LoadingWrapper>
  );
};

AddBlockForm.propTypes = {
  fetchBlockTemplates: PropTypes.func.isRequired,
  updateTemporaryPageBlocks: PropTypes.func.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired,
  backUrl: PropTypes.string.isRequired,
  title: PropTypes.object.isRequired,
};
