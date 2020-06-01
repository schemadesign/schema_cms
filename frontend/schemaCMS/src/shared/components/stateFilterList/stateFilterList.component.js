import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form as FormUI } from 'schemaUI';
import { always, append, equals, ifElse, reject } from 'ramda';
import { useHistory, useLocation } from 'react-router';

import messages from './stateFilterList.messages';
import { LoadingWrapper } from '../loadingWrapper';
import {
  DATA_SOURCE_STATE_ACTIVE_FILTERS,
  DATA_SOURCE_STATE_FILTERS,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { FilterName, containerCheckboxGroupStyles } from './stateFilterList.styles';

const { CheckboxGroup, Checkbox, Label } = FormUI;

export const StateFilterList = ({ filters, values, setFieldValue }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const handleGoToFilter = id => history.push(`/state/filter/${id}`, { backUrl: pathname, state: values });
  const handleChange = e => {
    const { value, checked } = e.target;
    const intValue = parseInt(value, 10);
    const isFilled = values.filters.find(({ filter }) => filter === intValue);

    if (checked && !isFilled) {
      return handleGoToFilter(value);
    }

    const setFilters = ifElse(
      equals(true),
      always(append(intValue, values[DATA_SOURCE_STATE_ACTIVE_FILTERS])),
      always(reject(equals(intValue), values[DATA_SOURCE_STATE_ACTIVE_FILTERS]))
    );

    return setFieldValue(DATA_SOURCE_STATE_ACTIVE_FILTERS, setFilters(checked));
  };

  return (
    <Fragment>
      <Label>
        <FormattedMessage {...messages[DATA_SOURCE_STATE_FILTERS]} />
      </Label>
      <LoadingWrapper noData={!filters.length} noDataContent={<FormattedMessage {...messages.noData} />}>
        <CheckboxGroup
          onChange={handleChange}
          name={DATA_SOURCE_STATE_FILTERS}
          value={values[DATA_SOURCE_STATE_ACTIVE_FILTERS]}
          customStyles={containerCheckboxGroupStyles}
        >
          {filters.map(({ id, name }, index) => (
            <Checkbox key={index} id={`checkbox-${index}`} value={id}>
              <FilterName id={`filterName-${index}`} onClick={() => handleGoToFilter(id)}>
                {name}
              </FilterName>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </LoadingWrapper>
    </Fragment>
  );
};

StateFilterList.propTypes = {
  state: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
