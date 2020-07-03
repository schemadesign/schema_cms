import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { isEmpty } from 'ramda';

import messages from './blockElement.messages';
import {
  getCustomSelectedWrapperStyles,
  SelectLabel,
  SelectWrapper,
  customSelectStyles,
  LabelItem,
} from './blockElement.styles';
import { getValuePath } from '../../utils/helpers';
import { Select } from '../form/select';
import { ELEMENT_PARAMS, INTERNAL_CONNECTION_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';

export const InternalConnectionElement = ({ blockPath, element, setFieldValue, index, pagerUrlOptions }) => {
  const intl = useIntl();
  const theme = useTheme();
  const name = getValuePath({ blockPath, index });
  const params = getValuePath({ blockPath, index, elementValue: ELEMENT_PARAMS });
  const handleSelectPageUrl = ({ value, url }) => {
    setFieldValue(name, url);
    setFieldValue(params, { pageId: value });
  };
  const options = pagerUrlOptions.map(({ url, label, id }) => ({
    value: id,
    label: (
      <SelectLabel>
        {label.map((name, index) => (
          <LabelItem key={index}>{name}</LabelItem>
        ))}
      </SelectLabel>
    ),
    url,
  }));
  const placeholderCopy = isEmpty(options) ? 'NoOptions' : 'Placeholder';
  const placeholder = intl.formatMessage(messages[`${INTERNAL_CONNECTION_TYPE}${placeholderCopy}`]);

  return (
    <SelectWrapper>
      <Select
        name={name}
        value={element.params.pageId}
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
