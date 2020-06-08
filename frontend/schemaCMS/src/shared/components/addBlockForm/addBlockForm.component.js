import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import { Icons } from 'schemaUI';
import { propEq, find, map, omit, pipe, prepend, always, defaultTo, filter, prop, includes } from 'ramda';

import { SelectContainer } from './addBlockForm.styles';
import { LoadingWrapper } from '../loadingWrapper';
import reportError from '../../utils/reportError';
import { BackButton, NavigationContainer, NextButton, PlusButton } from '../navigation';
import messages from './addBlockForm.messages';
import { ContextHeader } from '../contextHeader';
import {
  IconsContainer,
  inputContainerStyles,
  inputStyles,
  MobileInputName,
  mobilePlusStyles,
  PlusContainer,
  Subtitle,
} from '../form/frequentComponents.styles';
import { TextInput } from '../form/inputs/textInput';
import {
  ADD_BLOCK_SCHEMA,
  BLOCK_NAME,
  BLOCK_TYPE,
  INITIAL_VALUES_ADD_BLOCK,
  PAGE_BLOCKS,
} from '../../../modules/page/page.constants';
import { Select } from '../form/select';
import { setDefaultValue } from '../../utils/helpers';
import { BlockTemplateElements } from '../blockTemplateForm/blockTemplateElements.component';
import { CounterHeader } from '../counterHeader';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  WARNING_TYPES_LIST,
  getDefaultBlockElement,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { renderWhenTrue } from '../../utils/rendering';
import { PublicWarning } from '../publicWarning';

const { EditIcon } = Icons;

export const AddBlockForm = ({ fetchBlockTemplates, projectId, backUrl, title, blockTemplates }) => {
  const [loading, setLoading] = useState(true);
  const [warningTypes, setWarningTypes] = useState();
  const [error, setError] = useState(null);
  const history = useHistory();
  const intl = useIntl();
  const { state = {} } = useLocation();
  const blocksOptions = pipe(
    map(({ name, id, elements }) => ({
      label: name,
      value: id,
      warningTypes: pipe(
        filter(e => includes(prop('type', e), WARNING_TYPES_LIST)),
        map(e => prop('type', e))
      )(elements),
    })),
    prepend({ label: intl.formatMessage(messages.blank), value: 0 })
  )(blockTemplates);

  const { handleSubmit, handleChange, values, isValid, dirty, setFieldValue, ...restFormikProps } = useFormik({
    initialValues: INITIAL_VALUES_ADD_BLOCK,
    enableReinitialize: true,
    validationSchema: () => ADD_BLOCK_SCHEMA,
    onSubmit: ({ name, type, elements: customElements }) => {
      try {
        const blockTemplate = pipe(
          find(propEq('id', type)),
          defaultTo({
            elements: customElements,
            name,
          })
        )(blockTemplates);
        const { name: blockName, id, elements: templateElements, ...rest } = blockTemplate;
        const page = state.page || {};
        const blocks = page[PAGE_BLOCKS] || [];

        const elements = map(
          pipe(
            setDefaultValue,
            omit(['id'])
          )
        )(templateElements);

        const updatedPage = {
          ...page,
          [PAGE_BLOCKS]: [...blocks, { ...rest, name, key: Date.now(), type: blockName, block: id, elements }],
        };

        history.push(backUrl, { page: updatedPage });
      } catch (errors) {
        reportError(errors);
      }
    },
  });

  const elementsCount = 0;
  const addElement = () => {
    const elements = prepend(getDefaultBlockElement(), values[BLOCK_TEMPLATES_ELEMENTS]);

    setFieldValue(BLOCK_TEMPLATES_ELEMENTS, elements);
  };
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
        await fetchBlockTemplates({ projectId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  useEffect(() => {
    if (values) {
      const blockOption = find(propEq('value', values.type))(blocksOptions);
      setWarningTypes(blockOption ? blockOption.warningTypes : blockOption);
    }
  }, [values]);

  const renderBlockTemplateElements = blockType =>
    renderWhenTrue(
      always(
        <Fragment>
          <CounterHeader
            copy={intl.formatMessage(messages.elements)}
            count={elementsCount}
            right={
              <PlusContainer>
                <PlusButton
                  customStyles={mobilePlusStyles}
                  id="createElement"
                  onClick={addElement}
                  type="button"
                  disabled={!isValid && !!elementsCount}
                />
              </PlusContainer>
            }
          />
          <BlockTemplateElements
            handleChange={handleChange}
            values={values}
            isValid={isValid}
            setFieldValue={setFieldValue}
            {...restFormikProps}
          />
        </Fragment>
      )
    )(blockType === 0);

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
          <PublicWarning type={warningTypes} />
        </MobileInputName>
        <SelectContainer>
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
          <PublicWarning type={warningTypes} />
        </SelectContainer>
        {renderBlockTemplateElements(values[BLOCK_TYPE])}
        <NavigationContainer fixed>
          <BackButton id="backBtn" type="button" onClick={() => history.push(backUrl, { page: state.page })}>
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
  blockTemplates: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired,
  backUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
