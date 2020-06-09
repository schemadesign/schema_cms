import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { isEmpty } from 'ramda';

import messages from './blockElement.messages';
import { getCustomSelectedWrapperStyles, SelectLabel, SelectWrapper, customSelectStyles } from './blockElement.styles';
import { getValuePath } from '../../utils/helpers';
import { Select } from '../form/select';
import { INTERNAL_CONNECTION_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';

export const InternalConnectionElement = ({ blockPath, element, setFieldValue, index, pagerUrlOptions }) => {
  const intl = useIntl();
  const theme = useTheme();
  const name = getValuePath({ blockPath, index });
  const handleSelectPageUrl = ({ value }) => setFieldValue(name, value);
  const options = pagerUrlOptions.map(({ value, label }) => ({ value, label: <SelectLabel>{label}</SelectLabel> }));
  const placeholderCopy = isEmpty(options) ? 'NoOptions' : 'Placeholder';
  const placeholder = intl.formatMessage(messages[`${INTERNAL_CONNECTION_TYPE}${placeholderCopy}`]);

  return (
    <SelectWrapper>
      <Select
        name={name}
        value={element.value}
        options={options}
        onSelect={handleSelectPageUrl}
        placeholder={placeholder}
        customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
        customStyles={customSelectStyles}
        centerIcon
      />
    </SelectWrapper>
  );
};

InternalConnectionElement.propTypes = {
  element: PropTypes.object.isRequired,
  pagerUrlOptions: PropTypes.array.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
