import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { always } from 'ramda';

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
} from '../../../modules/projectState/projectState.constants';
import { renderWhenTrue } from '../../utils/rendering';

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

  renderInput = (values, name) =>
    renderWhenTrue(
      always(
        <TextInput
          value={values[name]}
          onChange={this.props.handleChange}
          name={name}
          label={this.props.intl.formatMessage(messages[name])}
          fullWidth
          isEdit
          {...this.props}
        />
      )
    )(!!values[name]);

  render() {
    const { handleChange, intl, values, state } = this.props;

    return (
      <Container>
        <Select
          label={intl.formatMessage(messages[PROJECT_STATE_DATA_SOURCE])}
          name={PROJECT_STATE_DATA_SOURCE}
          value={values[PROJECT_STATE_DATA_SOURCE]}
          options={this.getStatusOptions()}
          onSelect={this.handleSelectStatus}
          placeholder={intl.formatMessage(messages.dataSourcePlaceholder)}
        />
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
        {this.renderInput(state, PROJECT_STATE_AUTHOR)}
        {this.renderInput(state, PROJECT_STATE_CREATED)}
      </Container>
    );
  }
}
