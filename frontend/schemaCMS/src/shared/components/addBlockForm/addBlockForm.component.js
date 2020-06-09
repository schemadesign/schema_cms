import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import { propEq, find, map, omit, pipe, prepend, always, defaultTo, filter, prop, includes } from 'ramda';

import { SelectContainer } from './addBlockForm.styles';
import { LoadingWrapper } from '../loadingWrapper';
import reportError from '../../utils/reportError';
import { BackButton, NavigationContainer, NextButton, PlusButton } from '../navigation';
import messages from './addBlockForm.messages';
import { mobilePlusStyles, PlusContainer } from '../form/frequentComponents.styles';
import {
  ADD_BLOCK_SCHEMA,
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

export const AddBlockForm = ({ fetchBlockTemplates, projectId, backUrl, blockTemplates }) => {
  const [loading, setLoading] = useState(true);
  const [warningTypes, setWarningTypes] = useState();
  const [error, setError] = useState(null);
  const history = useHistory();
  const intl = useIntl();
  const { state = {} } = useLocation();
  const blankMessage = intl.formatMessage(messages.blank);
  const blocksOptions = pipe(
    map(({ name, id, elements }) => ({
      label: name,
      value: id,
      warningTypes: pipe(
        filter(e => includes(prop('type', e), WARNING_TYPES_LIST)),
        map(e => prop('type', e))
      )(elements),
    })),
    prepend({ label: blankMessage, value: 0 })
  )(blockTemplates);

  const { handleSubmit, handleChange, values, isValid, dirty, setFieldValue, ...restFormikProps } = useFormik({
    initialValues: INITIAL_VALUES_ADD_BLOCK,
    enableReinitialize: true,
    validationSchema: () => ADD_BLOCK_SCHEMA,
    onSubmit: ({ type, elements: customElements }) => {
      try {
        const blockTemplate = pipe(
          find(propEq('id', type)),
          defaultTo({
            elements: customElements,
            name: blankMessage,
          })
        )(blockTemplates);
        const { name, id, elements: templateElements, ...rest } = blockTemplate;
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
          [PAGE_BLOCKS]: [...blocks, { ...rest, name, key: Date.now(), type: name, block: id, elements }],
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
            values={{ ...values, name: blankMessage }}
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
};
