import React from 'react';
import PropTypes from 'prop-types';
import 'react-mde/lib/styles/css/react-mde-all.css';
import debounce from 'lodash.debounce';

import { getValuePath } from '../../utils/helpers';
import { getCustomSelectedWrapperStyles, ObservableHQContainer } from './blockElement.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './blockElement.messages';
import {
  OBSERVABLE_CELL,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_USER,
} from '../../../modules/blockTemplates/blockTemplates.constants';

export const ObservableHQElement = ({ element, blockPath, setFieldValue, index }) => {
  const observableUserName = getValuePath({ blockPath, index: `${index}.${OBSERVABLE_USER}` });
  const observableNotebookName = getValuePath({ blockPath, index: `${index}.${OBSERVABLE_NOTEBOOK}` });
  const observableCellName = getValuePath({ blockPath, index: `${index}.${OBSERVABLE_CELL}` });

  const handleOnChange = name => ({ currentElement: { value } }) => debounce(() => setFieldValue(name, value), 200);

  return (
    <ObservableHQContainer>
      <TextInput
        name={observableUserName}
        value={element[observableUserName].value}
        onChange={handleOnChange(observableUserName)}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_USER}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
      />
      <TextInput
        name={observableNotebookName}
        value={element[observableNotebookName].value}
        onChange={handleOnChange(observableNotebookName)}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_NOTEBOOK}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
      />
      <TextInput
        name={observableCellName}
        value={element[observableCellName].value}
        onChange={handleOnChange(observableCellName)}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_CELL}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
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
