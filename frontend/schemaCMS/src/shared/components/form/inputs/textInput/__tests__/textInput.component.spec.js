import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';
import { TextField } from 'schemaUI';

import { TextInput } from '../textInput.component';

describe('TextInput: Component', () => {
  const defaultProps = {
    touched: {},
    errors: {},
    value: '',
    name: 'A_FIELD_NAME',
    onChange: Function.prototype,
  };

  const component = props => <TextInput {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render error', () => {
    const errors = { A_FIELD_NAME: 'An error message' };
    const touched = { A_FIELD_NAME: true };

    const wrapper = render({ errors, touched });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call onChange on TextField change', () => {
    const onChange = spy();
    const wrapper = render({ onChange });

    wrapper.find(TextField).prop('onChange')();

    expect(onChange).to.have.been.calledOnce;
  });
});
