import React from 'react';
import PropTypes from 'prop-types';
import { always } from 'ramda';
import { Form, Icons } from 'schemaUI';
import dayjs from 'dayjs';
import { FormattedMessage, useIntl } from 'react-intl';

import { Container } from './dataSourceStateForm.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './dataSourceStateForm.messages';

import {
  DATA_SOURCE_STATE_DESCRIPTION,
  DATA_SOURCE_STATE_NAME,
  DATA_SOURCE_STATE_SOURCE_URL,
  DATA_SOURCE_STATE_AUTHOR,
  DATA_SOURCE_STATE_CREATED,
  DATA_SOURCE_STATE_TAGS,
  DATA_SOURCE_STATE_IS_PUBLIC,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { renderWhenTrue } from '../../utils/rendering';
import { BASE_DATE_FORMAT } from '../../utils/extendedDayjs';
import { TagSearch } from '../tagSearch';
import { StateFilterList } from '../stateFilterList';
import {
  AvailableCopy,
  BinIconContainer,
  SwitchContainer,
  SwitchContent,
  SwitchCopy,
  Switches,
  SwitchLabel,
} from '../form/frequentComponents.styles';

const { BinIcon } = Icons;
const { Switch, Label } = Form;

export const DataSourceStateForm = ({
  tagCategories,
  handleChange,
  values,
  filters,
  handleRemoveState,
  state = {},
  ...restFormikProps
}) => {
  const intl = useIntl();

  const renderInput = (value, name, formattedValue) =>
    renderWhenTrue(
      always(
        <TextInput
          value={formattedValue || value}
          onChange={handleChange}
          name={name}
          label={intl.formatMessage(messages[name])}
          fullWidth
          disabled
          {...restFormikProps}
        />
      )
    )(!!value);

  const binIcon = handleRemoveState ? (
    <BinIconContainer id="removeState" onClick={() => handleRemoveState(true)}>
      <BinIcon />
    </BinIconContainer>
  ) : null;

  return (
    <Container>
      <TextInput
        value={values[DATA_SOURCE_STATE_NAME]}
        onChange={handleChange}
        name={DATA_SOURCE_STATE_NAME}
        label={intl.formatMessage(messages[DATA_SOURCE_STATE_NAME])}
        fullWidth
        isEdit
        {...restFormikProps}
      />
      <TextInput
        value={values[DATA_SOURCE_STATE_DESCRIPTION]}
        onChange={handleChange}
        name={DATA_SOURCE_STATE_DESCRIPTION}
        label={intl.formatMessage(messages[DATA_SOURCE_STATE_DESCRIPTION])}
        fullWidth
        isEdit
        multiline
        {...restFormikProps}
      />
      <TextInput
        value={values[DATA_SOURCE_STATE_SOURCE_URL]}
        onChange={handleChange}
        name={DATA_SOURCE_STATE_SOURCE_URL}
        label={intl.formatMessage(messages[DATA_SOURCE_STATE_SOURCE_URL])}
        fullWidth
        isEdit
        {...restFormikProps}
      />
      {renderInput(values[DATA_SOURCE_STATE_AUTHOR], DATA_SOURCE_STATE_AUTHOR)}
      {renderInput(
        values[DATA_SOURCE_STATE_CREATED],
        DATA_SOURCE_STATE_CREATED,
        dayjs(values[DATA_SOURCE_STATE_CREATED], BASE_DATE_FORMAT).format('DD/MM/YYYY')
      )}
      <Label>
        <FormattedMessage {...messages[DATA_SOURCE_STATE_TAGS]} />
      </Label>
      <TagSearch
        tagCategories={tagCategories}
        values={values[DATA_SOURCE_STATE_TAGS]}
        valuePath="tags"
        {...restFormikProps}
      />
      <StateFilterList filters={filters} state={state} values={values} {...restFormikProps} />
      <Switches>
        <SwitchContainer>
          <SwitchContent>
            <Switch
              value={values[DATA_SOURCE_STATE_IS_PUBLIC]}
              id={DATA_SOURCE_STATE_IS_PUBLIC}
              onChange={handleChange}
            />
            <SwitchCopy>
              <SwitchLabel htmlFor={DATA_SOURCE_STATE_IS_PUBLIC}>
                <FormattedMessage {...messages[DATA_SOURCE_STATE_IS_PUBLIC]} />
              </SwitchLabel>
              <AvailableCopy>
                <FormattedMessage
                  {...messages.pageAvailability}
                  values={{
                    availability: intl.formatMessage(
                      messages[values[DATA_SOURCE_STATE_IS_PUBLIC] ? 'publicCopy' : 'privateCopy']
                    ),
                  }}
                />
              </AvailableCopy>
            </SwitchCopy>
          </SwitchContent>
          {binIcon}
        </SwitchContainer>
      </Switches>
    </Container>
  );
};

DataSourceStateForm.propTypes = {
  tagCategories: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemoveState: PropTypes.func,
  values: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  state: PropTypes.object,
};
