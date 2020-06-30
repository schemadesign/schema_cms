import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { asMutable } from 'seamless-immutable';
import { FormattedMessage } from 'react-intl';
import { always, ifElse, isNil, concat, flip } from 'ramda';

import { Title, Category } from './tagSearch.styles';
import messages from './tagSearch.messages';
import { MultiSelect } from '../form/multiSelect/multiSelect.component';

export const TagCategories = ({ name, isSingleSelect = false, selectedTags, tags, setFieldValue, id, valuePath }) => {
  const getValuePath = id => ifElse(isNil, always(`${id}`), flip(concat)(`.${id}`))(valuePath);
  const handleChange = selectedOption => setFieldValue(getValuePath(id), selectedOption);
  const mutableTags = asMutable(tags);
  const isDisabled = isSingleSelect && selectedTags.length === 1;
  const options = mutableTags.map(({ value }) => ({ value, label: value, isDisabled }));
  const limit = isSingleSelect ? 1 : options.length;
  const isLastOption = options.length - selectedTags.length === 1;

  return (
    <Fragment>
      <Title title={name}>
        <Category>
          <FormattedMessage {...messages.category} />
        </Category>
        {name}
      </Title>
      <MultiSelect
        closeMenuOnSelect={isLastOption || isSingleSelect}
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
  valuePath: PropTypes.string,
};
