import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useTheme } from 'styled-components';
import { Icons } from 'schemaUI';
import { toUpper, replace, isNil } from 'ramda';
import { parse, stringify } from 'query-string';
import { useLocation, useHistory } from 'react-router';

import { Container, SelectWrapper, getCarestStyles } from './sortingSelect.styles';
import { getCustomSelectStyles } from '../reactSelect.styles';
import { ASCENDING, DESCENDING } from '../../../utils/helpers';

const CREATED = 'created';
const MODIFIED = 'modified';
const { CaretIcon } = Icons;

export const SortingSelect = ({ sortingElements, addDateOptions = false, updateFunction }) => {
  const theme = useTheme();
  const history = useHistory();
  const customStyles = getCustomSelectStyles(theme);
  const capitalize = replace(/^./, toUpper);
  const { search } = useLocation();
  const { sortBy, sortDirection, ...restParams } = parse(search);
  const [sort, setSort] = useState(sortBy ? { label: capitalize(sortBy), value: sortBy } : null);
  const [direction, setDirection] = useState(sortDirection || ASCENDING);
  const dateOptions = addDateOptions ? [CREATED, MODIFIED] : [];
  const options = [...sortingElements, ...dateOptions].map(item => ({ label: capitalize(item), value: item }));

  const updateUrl = params => {
    const stringfied = stringify(params);
    history.push(`?${stringfied}`);
    updateFunction();
  };

  const handleOrderChange = data => {
    const params = data ? { ...restParams, sortBy: data.value, sortDirection: direction } : restParams;
    updateUrl(params);
    setSort(data);
  };

  const toogleDirection = () => {
    const sortDirection = direction === ASCENDING ? DESCENDING : ASCENDING;
    const params = { ...restParams, sortBy: sort.value, sortDirection };
    updateUrl(params);
    setDirection(sortDirection);
  };

  return (
    <Container>
      <SelectWrapper>
        <Select
          closeMenuOnSelect
          components={{ DropdownIndicator: null }}
          styles={customStyles}
          value={sort}
          onChange={handleOrderChange}
          options={options}
          isClearable
        />
      </SelectWrapper>
      <CaretIcon customStyles={getCarestStyles({ direction, disabled: isNil(sort) })} onClick={toogleDirection} />
    </Container>
  );
};

SortingSelect.propTypes = {
  sortingElements: PropTypes.array.isRequired,
  updateFunction: PropTypes.func.isRequired,
  addDateOptions: PropTypes.bool,
};
