import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { keys, map, pathOr, pipe, toString } from 'ramda';

import { TextInput } from '../form/inputs/textInput';
import messages from './filterForm.messages';
import {
  FILTER_FIELD,
  FILTER_FIELD_TYPE,
  FILTER_NAME,
  FILTER_TYPE,
  FILTER_UNIQUE_ITEMS,
  FILTERS_SCHEMA,
  INITIAL_VALUES,
} from '../../../modules/filter/filter.constants';
import { Select } from '../form/select';
import { Form, Row } from './filterForm.styles';
import { BackButton, NavigationContainer, NextButton } from '../navigation';

export class FilterForm extends PureComponent {
  static propTypes = {
    fieldsInfo: PropTypes.object.isRequired,
  };

  handleSelectStatus = ({ value, setFieldValue }) => setFieldValue(FILTER_FIELD, value);

  handleSubmit = () => {};

  render() {
    const fieldOptions = pipe(
      keys,
      map(key => ({ value: key, label: key }))
    )(this.props.fieldsInfo);
    INITIAL_VALUES[FILTER_FIELD] = fieldOptions[0].value;

    return (
      <Formik initialValues={INITIAL_VALUES} onSubmit={this.handleSubmit} validationSchema={FILTERS_SCHEMA}>
        {({ values, handleChange, setFieldValue, dirty, isValid, ...rest }) => {
          const filterField = values[FILTER_FIELD];
          const uniqueItems = pathOr(values[FILTER_UNIQUE_ITEMS], ['fieldsInfo', filterField, 'unique'], this.props);
          const fieldType = pathOr(values[FILTER_FIELD_TYPE], ['fieldsInfo', filterField, 'type'], this.props);

          return (
            <Form>
              <TextInput
                value={values[FILTER_NAME]}
                onChange={handleChange}
                name={FILTER_NAME}
                fullWidth
                label={<FormattedMessage {...messages[FILTER_NAME]} />}
                {...rest}
              />
              <TextInput
                value={values[FILTER_TYPE]}
                onChange={handleChange}
                name={FILTER_TYPE}
                fullWidth
                label={<FormattedMessage {...messages[FILTER_TYPE]} />}
                {...rest}
              />
              <Select
                label={<FormattedMessage {...messages[FILTER_FIELD]} />}
                name={FILTER_FIELD}
                value={values[FILTER_FIELD]}
                options={fieldOptions}
                defaultOption={{ value: '', label: '' }}
                onSelect={({ value }) => this.handleSelectStatus({ value, setFieldValue })}
              />
              <Row>
                <TextInput
                  value={fieldType}
                  name={FILTER_FIELD_TYPE}
                  fullWidth
                  label={<FormattedMessage {...messages[FILTER_FIELD_TYPE]} />}
                  disabled
                  {...rest}
                />
                <TextInput
                  value={toString(uniqueItems)}
                  name={FILTER_UNIQUE_ITEMS}
                  fullWidth
                  label={<FormattedMessage {...messages[FILTER_UNIQUE_ITEMS]} />}
                  disabled
                  {...rest}
                />
              </Row>
              <NavigationContainer>
                <BackButton>
                  <FormattedMessage {...messages.deleteFilter} type="button" />
                </BackButton>
                <NextButton disabled={!dirty || !isValid} type="submit">
                  <FormattedMessage {...messages.saveFilter} />
                </NextButton>
              </NavigationContainer>
            </Form>
          );
        }}
      </Formik>
    );
  }
}
