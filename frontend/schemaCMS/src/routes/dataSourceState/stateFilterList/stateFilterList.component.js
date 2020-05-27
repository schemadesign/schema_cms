import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form as FormUI } from 'schemaUI';
import { always, append, equals, ifElse, reject } from 'ramda';
import { useHistory } from 'react-router';

import messages from './stateFilterList.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { DATA_SOURCE_STATE_FILTERS } from '../../../modules/dataSourceState/dataSourceState.constants';
import { Link, containerCheckboxGroupStyles } from './stateFilterList.styles';

const { CheckboxGroup, Checkbox, Label } = FormUI;

export const StateFilterList = ({ filters, values, state, setFieldValue }) => {
  const history = useHistory();
  const handleChange = e => {
    const { value, checked } = e.target;
    const intValue = parseInt(value, 10);
    const isFilled = state.filters.find(({ filter }) => filter === intValue);

    if (checked && !isFilled) {
      return history.push(`/state/${state.id}/filter/${value}`);
    }

    const setFilters = ifElse(equals(true), always(append(intValue, values)), always(reject(equals(intValue), values)));

    return setFieldValue(DATA_SOURCE_STATE_FILTERS, setFilters(checked));
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
          value={values}
          customStyles={containerCheckboxGroupStyles}
        >
          {filters.map(({ id, name }, index) => (
            <Checkbox key={index} id={`checkbox-${index}`} value={id}>
              <Link to={`/state/${state.id}/filter/${id}`}>{name}</Link>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </LoadingWrapper>
    </Fragment>
  );
};

StateFilterList.propTypes = {
  state: PropTypes.object.isRequired,
  values: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
