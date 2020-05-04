import React from 'react';
import PropTypes from 'prop-types';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';

import { getValuePath } from '../../utils/helpers';
import { getCustomSelectedWrapperStyles, ObservableHQContainer } from './blockElement.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './blockElement.messages';
import {
  OBSERVABLE_CELL,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_PARAMS,
  OBSERVABLE_USER,
} from '../../../modules/blockTemplates/blockTemplates.constants';

export const ObservableHQElement = ({ element, blockPath, setFieldValue, index, ...restFormikProps }) => {
  const intl = useIntl();
  const theme = useTheme();
  const observableUserName = getValuePath({ blockPath, index: `${index}.value`, elementValue: OBSERVABLE_USER });
  const observableNotebookName = getValuePath({
    blockPath,
    index: `${index}.value`,
    elementValue: OBSERVABLE_NOTEBOOK,
  });
  const observableCellName = getValuePath({ blockPath, index: `${index}.value`, elementValue: OBSERVABLE_CELL });
  const observableParamsName = getValuePath({ blockPath, index: `${index}.value`, elementValue: OBSERVABLE_PARAMS });

  return (
    <ObservableHQContainer>
      <TextInput
        name={observableUserName}
        value={element.value[OBSERVABLE_USER]}
        onChange={({ currentTarget: { value } }) => setFieldValue(observableUserName, value)}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_USER}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
        {...restFormikProps}
      />
      <TextInput
        name={observableNotebookName}
        value={element.value[OBSERVABLE_NOTEBOOK]}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_NOTEBOOK}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
        {...restFormikProps}
      />
      <TextInput
        name={observableCellName}
        value={element.value[OBSERVABLE_CELL]}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_CELL}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
        {...restFormikProps}
      />

      <TextInput
        name={observableParamsName}
        value={element.value[OBSERVABLE_PARAMS]}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_PARAMS}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
        {...restFormikProps}
      />
    </ObservableHQContainer>
  );
};

ObservableHQElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
