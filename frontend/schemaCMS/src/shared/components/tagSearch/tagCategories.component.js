import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import { asMutable } from 'seamless-immutable';
import { FormattedMessage } from 'react-intl';
import { always, ifElse, isNil, concat, flip } from 'ramda';

import { Title, Category } from './tagSearch.styles';
import messages from './tagSearch.messages';

const DropdownIndicator = props => {
  const { selectProps } = props;

  return (
    <components.DropdownIndicator {...props}>
      {selectProps.value.length}/{selectProps.limit}
    </components.DropdownIndicator>
  );
};

DropdownIndicator.propTypes = {
  selectProps: PropTypes.object.isRequired,
};

export const TagCategories = ({
  name,
  isSingleSelect = false,
  selectedTags,
  tags,
  setFieldValue,
  id,
  customStyles,
  valuePath,
}) => {
  const getValuePath = id => ifElse(isNil, always(`${id}`), flip(concat)(`.${id}`))(valuePath);
  const handleChange = selectedOption => setFieldValue(getValuePath(id), selectedOption);
  const mutableTags = asMutable(tags);
  const isDisabled = isSingleSelect && selectedTags.length === 1;
  const options = mutableTags.map(({ value }) => ({ value, label: value, isDisabled }));
  const limit = isSingleSelect ? 1 : options.length;
  const isLastOption = options.length - selectedTags.length === 1;

  return (
    <Fragment>
      <Title>
        <Category>
          <FormattedMessage {...messages.category} />
        </Category>
        {name}
      </Title>
      <Select
        closeMenuOnSelect={isLastOption || isSingleSelect}
        components={{ DropdownIndicator }}
        styles={customStyles}
        value={selectedTags}
        onChange={handleChange}
        options={options}
        isMulti
        limit={limit}
      />
    </Fragment>
  );
};

TagCategories.propTypes = {
  name: PropTypes.string.isRequired,
  selectedTags: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  isSingleSelect: PropTypes.bool,
  customStyles: PropTypes.object.isRequired,
  valuePath: PropTypes.string,
};
