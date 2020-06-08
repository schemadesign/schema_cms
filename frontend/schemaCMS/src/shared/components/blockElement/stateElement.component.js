import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';

import messages from './blockElement.messages';
import { getCustomSelectedWrapperStyles, SelectLabel, SelectWrapper, customSelectStyles } from './blockElement.styles';
import { getValuePath } from '../../utils/helpers';
import { Select } from '../form/select';
import { STATE_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';

export const StateElement = ({ blockPath, element, setFieldValue, index, stateOptions }) => {
  const intl = useIntl();
  const theme = useTheme();
  const name = getValuePath({ blockPath, index });
  const handleSelectPageUrl = ({ value }) => setFieldValue(name, value);
  const options = stateOptions.map(({ value, label }) => ({ value, label: <SelectLabel>{label}</SelectLabel> }));

  return (
    <SelectWrapper>
      <Select
        name={name}
        value={element.value}
        options={options}
        onSelect={handleSelectPageUrl}
        placeholder={intl.formatMessage(messages[`${STATE_TYPE}Placeholder`])}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        customStyles={customSelectStyles}
        centerIcon
      />
    </SelectWrapper>
  );
};

StateElement.propTypes = {
  element: PropTypes.object.isRequired,
  stateOptions: PropTypes.array.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
