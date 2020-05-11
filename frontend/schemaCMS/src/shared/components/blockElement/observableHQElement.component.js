import React from 'react';
import PropTypes from 'prop-types';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';

import { getValuePath } from '../../utils/helpers';
import { getCustomInputStyles, ObservableHQContainer, Label } from './blockElement.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './blockElement.messages';
import {
  OBSERVABLE_CELL,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_PARAMS,
  OBSERVABLE_USER,
} from '../../../modules/blockTemplates/blockTemplates.constants';

export const ObservableHQElement = ({ element, blockPath, index, handleChange, ...restFormikProps }) => {
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
      <Label>
        <FormattedMessage {...messages[`${OBSERVABLE_USER}Placeholder`]} />
      </Label>
      <TextInput
        name={observableUserName}
        value={element.value[OBSERVABLE_USER]}
        onChange={handleChange}
        customInputStyles={getCustomInputStyles(theme)}
        fullWidth
        centerIcon
        {...restFormikProps}
      />
      <Label>
        <FormattedMessage {...messages[`${OBSERVABLE_NOTEBOOK}Placeholder`]} />
      </Label>
      <TextInput
        name={observableNotebookName}
        value={element.value[OBSERVABLE_NOTEBOOK]}
        onChange={handleChange}
        customInputStyles={getCustomInputStyles(theme)}
        fullWidth
        centerIcon
        {...restFormikProps}
      />
      <Label>
        <FormattedMessage {...messages[`${OBSERVABLE_CELL}Placeholder`]} />
      </Label>
      <TextInput
        name={observableCellName}
        value={element.value[OBSERVABLE_CELL]}
        onChange={handleChange}
        customInputStyles={getCustomInputStyles(theme)}
        fullWidth
        centerIcon
        {...restFormikProps}
      />
      <Label>
        <FormattedMessage {...messages[`${OBSERVABLE_PARAMS}Placeholder`]} />
      </Label>
      <TextInput
        name={observableParamsName}
        value={element.value[OBSERVABLE_PARAMS]}
        onChange={handleChange}
        customInputStyles={getCustomInputStyles(theme)}
        fullWidth
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
  handleChange: PropTypes.func.isRequired,
};
