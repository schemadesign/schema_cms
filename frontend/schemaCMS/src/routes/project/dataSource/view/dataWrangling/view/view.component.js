import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { TextInput } from '../../../../../../shared/components/form/inputs/textInput';
import { Loader } from '../../../../../../shared/components/loader';
import { Container, Form, codeStyles } from './view.styles';
import messages from './view.messages';

export class View extends PureComponent {
  static propTypes = {
    dataWrangling: PropTypes.object,
    fetchDataWrangling: PropTypes.func.isRequired,
    unmountDataWrangling: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const descriptionFieldProps = {
      name: 'description',
      value: 'Remove blanks',
      label: this.props.intl.formatMessage(messages.description),
      placeholder: this.props.intl.formatMessage(messages.descriptionPlaceholder),
      fullWidth: true,
      disabled: true,
    };

    const codeFieldProps = {
      name: 'code',
      value:
        'df.columns = map(str.lower, df.columns) lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum  lorem ipsum ',
      label: this.props.intl.formatMessage(messages.code),
      placeholder: this.props.intl.formatMessage(messages.codePlaceholder),
      fullWidth: true,
      disabled: true,
      multiline: true,
      customInputStyles: codeStyles,
    };

    return (
      <Container>
        <Form>
          <TextInput {...descriptionFieldProps} />
          <TextInput {...codeFieldProps} />
        </Form>
      </Container>
    );
  }
}
