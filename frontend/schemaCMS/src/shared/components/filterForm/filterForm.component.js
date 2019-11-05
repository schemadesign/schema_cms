import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { TextInput } from '../form/inputs/textInput';

export class FilterForm extends PureComponent {
  static propTypes = {
    fieldsInfo: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Formik initialValues={{}} onSubmit={this.handleSubmit}>
        {({ values: { name }, handleChange, ...rest }) => {
          return (
            <TextInput
              value={name || ''}
              onChange={handleChange}
              name={'name'}
              fullWidth
              checkOnlyErrors
              label={'textt'}
              {...rest}
            />
          );
        }}
      </Formik>
    );
  }
}
