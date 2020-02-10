import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always, pipe, propEq, prop, path, find } from 'ramda';
import { Form } from 'schemaUI';
import dayjs from 'dayjs';

import { Container } from './projectStateForm.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './projectStateForm.messages';
import { Select } from '../form/select';
import {
  PROJECT_STATE_DATA_SOURCE,
  PROJECT_STATE_DESCRIPTION,
  PROJECT_STATE_NAME,
  PROJECT_STATE_SOURCE_URL,
  PROJECT_STATE_AUTHOR,
  PROJECT_STATE_CREATED,
  PROJECT_STATE_IS_PUBLIC,
} from '../../../modules/projectState/projectState.constants';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../utils/rendering';

const { Switch } = Form;

export class ProjectStateForm extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    state: PropTypes.object,
    dataSources: PropTypes.array.isRequired,
  };

  static defaultProps = {
    state: {},
  };

  getStatusOptions = () =>
    this.props.dataSources.map(({ name, id }) => ({
      value: id,
      label: name,
    }));

  handleSelectStatus = ({ value }) => {
    this.props.setFieldValue(PROJECT_STATE_DATA_SOURCE, value);
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

  renderSelect = (value, stateValue, name) =>
    renderWhenTrueOtherwise(
      always(
        <TextInput
          value={pipe(
            path(['props', 'dataSources']),
            find(propEq('id', value)),
            prop('name')
          )(this)}
          onChange={this.props.handleChange}
          name={name}
          label={this.props.intl.formatMessage(messages[name])}
          fullWidth
          disabled
          {...this.props}
        />
      ),
      always(
        <Select
          label={this.props.intl.formatMessage(messages[name])}
          name={name}
          value={value}
          options={this.getStatusOptions()}
          onSelect={this.handleSelectStatus}
          placeholder={this.props.intl.formatMessage(messages.dataSourcePlaceholder)}
        />
      )
    )(!!stateValue);

  render() {
    const { handleChange, intl, values, state } = this.props;

    return (
      <Container>
        {this.renderSelect(
          values[PROJECT_STATE_DATA_SOURCE],
          state[PROJECT_STATE_DATA_SOURCE],
          PROJECT_STATE_DATA_SOURCE
        )}
        <TextInput
          value={values[PROJECT_STATE_NAME]}
          onChange={handleChange}
          name={PROJECT_STATE_NAME}
          label={intl.formatMessage(messages[PROJECT_STATE_NAME])}
          fullWidth
          isEdit
          {...this.props}
        />
        <TextInput
          value={values[PROJECT_STATE_DESCRIPTION]}
          onChange={handleChange}
          name={PROJECT_STATE_DESCRIPTION}
          label={intl.formatMessage(messages[PROJECT_STATE_DESCRIPTION])}
          fullWidth
          isEdit
          multiline
          {...this.props}
        />
        <TextInput
          value={values[PROJECT_STATE_SOURCE_URL]}
          onChange={handleChange}
          name={PROJECT_STATE_SOURCE_URL}
          label={intl.formatMessage(messages[PROJECT_STATE_SOURCE_URL])}
          fullWidth
          isEdit
          {...this.props}
        />
        {this.renderInput(state[PROJECT_STATE_AUTHOR], PROJECT_STATE_AUTHOR)}
        {this.renderInput(dayjs(state[PROJECT_STATE_CREATED]).format('DD/MM/YYYY'), PROJECT_STATE_CREATED)}
        <Switch
          value={values[PROJECT_STATE_IS_PUBLIC]}
          id={PROJECT_STATE_IS_PUBLIC}
          onChange={handleChange}
          label={intl.formatMessage(messages[PROJECT_STATE_IS_PUBLIC])}
        />
      </Container>
    );
  }
}
