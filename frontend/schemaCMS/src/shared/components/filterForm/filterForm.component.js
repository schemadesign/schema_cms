import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FormattedMessage } from 'react-intl';

import { TextInput } from '../form/inputs/textInput';
import messages from './filterForm.messages';
import {
  FILTER_NAME,
  INITIAL_VALUES,
  FILTER_UNIQUE_ITEMS,
  FILTER_TYPE,
  FILTER_FIELD_TYPE,
  FILTER_FIELD,
} from '../../../modules/filter/filter.constants';
import { Select } from '../form/select';

export class FilterForm extends PureComponent {
  static propTypes = {
    fieldsInfo: PropTypes.object.isRequired,
  };

  render() {
    const fieldOptions = this.props.fieldsInfo.keys();

    return (
      <Formik initialValues={INITIAL_VALUES} onSubmit={this.handleSubmit}>
        {({ values, handleChange, ...rest }) => {
          return (
            <Fragment>
              <TextInput
                value={values[FILTER_NAME]}
                onChange={handleChange}
                name={FILTER_NAME}
                fullWidth
                checkOnlyErrors
                label={<FormattedMessage {...messages[FILTER_NAME]} />}
                {...rest}
              />
              <TextInput
                value={values[FILTER_TYPE]}
                onChange={handleChange}
                name={FILTER_TYPE}
                fullWidth
                checkOnlyErrors
                label={<FormattedMessage {...messages[FILTER_TYPE]} />}
                {...rest}
              />
              <Select
                label={<FormattedMessage {...messages[FILTER_FIELD]} />}
                name={FILTER_FIELD}
                value={values[FILTER_FIELD]}
                options={fieldOptions}
                onSelect={handleChange}
              />
              <TextInput
                value={values[FILTER_FIELD_TYPE]}
                onChange={handleChange}
                name={FILTER_FIELD_TYPE}
                fullWidth
                checkOnlyErrors
                label={<FormattedMessage {...messages[FILTER_FIELD_TYPE]} />}
                {...rest}
              />
              <TextInput
                value={values[FILTER_UNIQUE_ITEMS]}
                onChange={handleChange}
                name={FILTER_UNIQUE_ITEMS}
                fullWidth
                checkOnlyErrors
                label={<FormattedMessage {...messages[FILTER_UNIQUE_ITEMS]} />}
                {...rest}
              />
            </Fragment>
          );
        }}
      </Formik>
    );
  }
}
