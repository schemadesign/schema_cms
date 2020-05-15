import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import Select, { components } from 'react-select';
import { asMutable } from 'seamless-immutable';
import { always, ifElse, equals, isNil, concat, flip } from 'ramda';

import { Title } from './tagSearch.styles';

const { CaretIcon } = Icons;

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretIcon />
    </components.DropdownIndicator>
  );
};

export const TagCategories = ({
  name,
  isSingleSelect,
  selectedTags,
  tags,
  setFieldValue,
  id,
  customStyles,
  valuePath,
}) => {
  const formatSelectedOption = selectedOption =>
    ifElse(equals(true), always([selectedOption]), always(selectedOption))(isSingleSelect);
  const formattedSelectedTags = ifElse(equals(true), always(selectedTags[0]), always(selectedTags))(isSingleSelect);
  const getValuePath = id => ifElse(isNil, always(`${id}`), flip(concat)(`.${id}`))(valuePath);
  const handleChange = selectedOption => setFieldValue(getValuePath(id), formatSelectedOption(selectedOption));
  const mutableTags = asMutable(tags);
  const options = mutableTags.map(({ value }) => ({ value, label: value }));

  return (
    <Fragment>
      <Title>{name}</Title>
      <Select
        isClearable
        closeMenuOnSelect={isSingleSelect}
        components={{ DropdownIndicator }}
        styles={customStyles}
        value={formattedSelectedTags}
        onChange={handleChange}
        options={options}
        isMulti={!isSingleSelect}
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
  isSingleSelect: PropTypes.bool.isRequired,
  customStyles: PropTypes.object.isRequired,
  valuePath: PropTypes.string,
};
