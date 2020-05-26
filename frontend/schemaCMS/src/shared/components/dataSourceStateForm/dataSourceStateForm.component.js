import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always } from 'ramda';
import { Form } from 'schemaUI';
import dayjs from 'dayjs';

import { Container } from './dataSourceStateForm.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './dataSourceStateForm.messages';

import {
  DATA_SOURCE_STATE_DESCRIPTION,
  DATA_SOURCE_STATE_NAME,
  DATA_SOURCE_STATE_SOURCE_URL,
  DATA_SOURCE_STATE_AUTHOR,
  DATA_SOURCE_STATE_CREATED,
  DATA_SOURCE_STATE_IS_PUBLIC,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { renderWhenTrue } from '../../utils/rendering';

const { Switch } = Form;

export class DataSourceStateForm extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
  };

  renderInput = (value, name) =>
    renderWhenTrue(
      always(
        <TextInput
          value={value}
          onChange={this.props.handleChange}
          name={name}
          label={this.props.intl.formatMessage(messages[name])}
          fullWidth
          disabled
          {...this.props}
        />
      )
    )(!!value);

  render() {
    const { handleChange, intl, values } = this.props;

    return (
      <Container>
        <TextInput
          value={values[DATA_SOURCE_STATE_NAME]}
          onChange={handleChange}
          name={DATA_SOURCE_STATE_NAME}
          label={intl.formatMessage(messages[DATA_SOURCE_STATE_NAME])}
          fullWidth
          isEdit
          {...this.props}
        />
        <TextInput
          value={values[DATA_SOURCE_STATE_DESCRIPTION]}
          onChange={handleChange}
          name={DATA_SOURCE_STATE_DESCRIPTION}
          label={intl.formatMessage(messages[DATA_SOURCE_STATE_DESCRIPTION])}
          fullWidth
          isEdit
          multiline
          {...this.props}
        />
        <TextInput
          value={values[DATA_SOURCE_STATE_SOURCE_URL]}
          onChange={handleChange}
          name={DATA_SOURCE_STATE_SOURCE_URL}
          label={intl.formatMessage(messages[DATA_SOURCE_STATE_SOURCE_URL])}
          fullWidth
          isEdit
          {...this.props}
        />
        {this.renderInput(values[DATA_SOURCE_STATE_AUTHOR], DATA_SOURCE_STATE_AUTHOR)}
        {this.renderInput(dayjs(values[DATA_SOURCE_STATE_CREATED]).format('DD/MM/YYYY'), DATA_SOURCE_STATE_CREATED)}
        <Switch
          value={values[DATA_SOURCE_STATE_IS_PUBLIC]}
          id={DATA_SOURCE_STATE_IS_PUBLIC}
          onChange={handleChange}
          label={intl.formatMessage(messages[DATA_SOURCE_STATE_IS_PUBLIC])}
        />
      </Container>
    );
  }
}
