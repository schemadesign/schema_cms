import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container } from './create.styles';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { PROJECT_TITLE } from '../../../modules/project/project.constants';

export class Create extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { values, handleChange, handleSubmit } = this.props;

    return (
      <Container>
        <form onSubmit={handleSubmit}>
          <TextInput value={values[PROJECT_TITLE]} onChange={handleChange} name={PROJECT_TITLE} {...this.props} />
        </form>
      </Container>
    );
  }
}
