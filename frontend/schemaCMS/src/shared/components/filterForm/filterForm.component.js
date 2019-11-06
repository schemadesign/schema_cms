import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { keys, map, path, pipe, toString } from 'ramda';

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
    createFilter: PropTypes.func.isRequired,
    dataSourceId: PropTypes.string.isRequired,
  };

  getDependencyValues = value => ({
    uniqueItems: path(['fieldsInfo', value, 'unique'], this.props),
    fieldType: path(['fieldsInfo', value, 'type'], this.props),
  });

  handleSelectStatus = ({ value, setFieldValue }) => {
    const { uniqueItems, fieldType } = this.getDependencyValues(value);

    setFieldValue(FILTER_UNIQUE_ITEMS, toString(uniqueItems));
    setFieldValue(FILTER_FIELD_TYPE, fieldType);
    setFieldValue(FILTER_FIELD, value);
  };

  handleSubmit = formData => {
    this.props.createFilter({ dataSourceId: this.props.dataSourceId, formData });
  };

  render() {
    const fieldOptions = pipe(
      keys,
      map(key => ({ value: key, label: key }))
    )(this.props.fieldsInfo);
    const firstValue = fieldOptions[0].value;
    const { uniqueItems, fieldType } = this.getDependencyValues(firstValue);
    const initialValues = {
      ...INITIAL_VALUES,
      [FILTER_FIELD]: fieldOptions[0].value,
      [FILTER_UNIQUE_ITEMS]: toString(uniqueItems),
      [FILTER_FIELD_TYPE]: fieldType,
    };

    return (
      <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validationSchema={FILTERS_SCHEMA}>
        {({ values, handleChange, setFieldValue, dirty, isValid, ...rest }) => {
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
                  value={values[FILTER_FIELD_TYPE]}
                  name={FILTER_FIELD_TYPE}
                  fullWidth
                  label={<FormattedMessage {...messages[FILTER_FIELD_TYPE]} />}
                  disabled
                  {...rest}
                />
                <TextInput
                  value={values[FILTER_UNIQUE_ITEMS]}
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
