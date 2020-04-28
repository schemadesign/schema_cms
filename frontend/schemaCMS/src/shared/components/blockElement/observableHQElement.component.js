import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { useDebounce } from 'react-use';

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
  const intl = useIntl();
  const theme = useTheme();
  const observableUserName = getValuePath({ blockPath, index: `${index}.${OBSERVABLE_USER}` });
  const observableNotebookName = getValuePath({ blockPath, index: `${index}.${OBSERVABLE_NOTEBOOK}` });
  const observableCellName = getValuePath({ blockPath, index: `${index}.${OBSERVABLE_CELL}` });

  const [observableUser, setObservableUser] = useState('');
  const [observableNotebook, setObservableNotebook] = useState('');
  const [observableCell, setObservableCell] = useState('');

  useDebounce(
    () => {
      setFieldValue(observableUserName, observableUser);
    },
    200,
    [observableUser]
  );

  useDebounce(
    () => {
      setFieldValue(observableNotebookName, observableNotebook);
    },
    200,
    [observableNotebook]
  );

  useDebounce(
    () => {
      setFieldValue(observableCellName, observableCell);
    },
    200,
    [observableCell]
  );

  return (
    <ObservableHQContainer>
      <TextInput
        name={observableUserName}
        value={element.value[observableUserName]}
        onChange={({ currentTarget: { value } }) => setObservableUser(value)}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_USER}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
      />
      <TextInput
        name={observableNotebookName}
        value={element.value[observableNotebookName]}
        onChange={({ currentTarget: { value } }) => setObservableNotebook(value)}
        placeholder={intl.formatMessage(messages[`${OBSERVABLE_NOTEBOOK}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        centerIcon
      />
      <TextInput
        name={observableCellName}
        value={element.value[observableCellName]}
        onChange={({ currentTarget: { value } }) => setObservableCell(value)}
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
