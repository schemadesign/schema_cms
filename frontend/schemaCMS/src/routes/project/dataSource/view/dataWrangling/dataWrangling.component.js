import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';

import { Container } from './dataWrangling.styles';

const { CheckboxGroup, Checkbox } = Form;

export class DataWrangling extends PureComponent {
  static propTypes = {
    dataWrangling: PropTypes.array.isRequired,
  };

  renderCheckboxes = () =>
    this.props.dataWrangling.map((item, index) => (
      <Checkbox id={index} value={item} key={index} isEdit>
        {item}
      </Checkbox>
    ));

  render() {
    return (
      <Container>
        <CheckboxGroup name="dataWrangling" onChange={() => {}}>
          {this.renderCheckboxes()}
        </CheckboxGroup>
      </Container>
    );
  }
}
