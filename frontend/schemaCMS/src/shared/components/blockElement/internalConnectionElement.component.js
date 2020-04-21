import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useTheme } from 'styled-components';

import messages from './blockElement.messages';
import { getCustomSelectedWrapperStyles } from './blockElement.styles';
import { getValuePath } from '../../utils/helpers';
import { Select } from '../form/select';
import { INTERNAL_CONNECTION_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';

export const InternalConnectionElement = ({ blockPath, element, setFieldValue, index }) => {
  const intl = useIntl();
  const theme = useTheme();
  const name = getValuePath({ blockPath, index });
  const pageOptions = [{ label: 'page', value: 'http://url.com' }];
  const handleSelectPage = ({ value }) => setFieldValue(name, value);

  return (
    <Select
      name={name}
      value={element.value}
      options={pageOptions}
      onSelect={handleSelectPage}
      placeholder={intl.formatMessage(messages[`${INTERNAL_CONNECTION_TYPE}Placeholder`])}
      customSelectedWrapperStyles={getCustomSelectedWrapperStyles(theme)}
      centerIcon
    />
  );
};

InternalConnectionElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
