import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container, Form } from './createPageBlock.styles';
import { BLOCK_NAME, BLOCK_TYPE, VALID_TYPE_OPTIONS, NONE } from '../../../modules/pageBlock/pageBlock.constants';
import messages from './createPageBlock.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Select } from '../../../shared/components/form/select';

export class CreatePageBlock extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  };

  getStatusOptions = intl =>
    [...VALID_TYPE_OPTIONS, NONE].map(status => ({
      value: status,
      label: intl.formatMessage(messages[status]),
    }));

  handleSelectStatus = ({ value: selectedStatus }) => {
    this.props.setFieldValue(BLOCK_TYPE, selectedStatus);
  };

  render() {
    const { intl, handleSubmit, handleChange, values, ...restProps } = this.props;

    return (
      <Container>
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={values[BLOCK_NAME]}
            onChange={handleChange}
            name={BLOCK_NAME}
            label={intl.formatMessage(messages.pageBlockFieldName)}
            placeholder={intl.formatMessage(messages.pageBlockFieldNamePlaceholder)}
            fullWidth
            {...restProps}
          />
          <Select
            label={intl.formatMessage(messages.pageBlockFieldType)}
            name={BLOCK_TYPE}
            value={values[BLOCK_TYPE]}
            options={this.getStatusOptions(intl)}
            onSelect={this.handleSelectStatus}
            id="fieldBlockType"
          />
        </Form>
      </Container>
    );
  }
}
