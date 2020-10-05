import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import { Prompt, useHistory, useLocation, useRouteMatch } from 'react-router';
import { propEq, find, map, omit, pipe, prepend, always, defaultTo } from 'ramda';

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
  getDefaultBlockElement,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { renderWhenTrue } from '../../utils/rendering';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';

export const AddBlockForm = ({ fetchBlockTemplates, projectId, backUrl, blockTemplates }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customLocation, setCustomLocation] = useState(false);
  const [leavingPageModalOpen, setLeavingPageModalOpen] = useState(false);
  const [leavingPageLoading, setLeavingPageLoading] = useState(false);
  const history = useHistory();
  const match = useRouteMatch();
  const intl = useIntl();
  const { state = {} } = useLocation();
  const blankMessage = intl.formatMessage(messages.blank);
  const blocksOptions = pipe(
    map(({ name, id }) => ({
      label: name,
      value: id,
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
        setCustomLocation(true);
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

  const handleConfirmLeavePage = async () => {
    try {
      setLeavingPageLoading(true);
      history.push(customLocation);
    } catch (e) {
      reportError(e);
      setLeavingPageLoading(false);
    }
  };

  const handlePromptMessage = goToLocation => {
    if (!customLocation && !goToLocation.pathname !== match.url) {
      setCustomLocation(goToLocation);
      setLeavingPageModalOpen(true);
    }

    return false;
  };

  const handleBackButtonClick = () => {
    setLeavingPageModalOpen(false);
    setCustomLocation(false);
  };

  const handleBackClick = () => history.push(backUrl, { page: state.page });

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
            dirty={dirty}
            {...restFormikProps}
          />
        </SelectContainer>
        {renderBlockTemplateElements(values[BLOCK_TYPE])}
        <NavigationContainer fixed>
          <BackButton id="backBtn" type="button" onClick={handleBackClick}>
            <FormattedMessage {...messages.back} />
          </BackButton>
          <NextButton id="addBlock" type="submit" disabled={!isValid || !dirty}>
            <FormattedMessage {...messages.add} />
          </NextButton>
        </NavigationContainer>
      </form>
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
            <FormattedMessage {...messages.confirm} />
          </NextButton>
        </ModalActions>
      </Modal>
      <Prompt when={dirty} message={goToLocation => handlePromptMessage(goToLocation)} />
    </LoadingWrapper>
  );
};

AddBlockForm.propTypes = {
  fetchBlockTemplates: PropTypes.func.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired,
  backUrl: PropTypes.string.isRequired,
};
