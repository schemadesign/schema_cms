import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import { UserCreate } from '../userCreate.component';
import { defaultProps } from '../userCreate.stories';
import { Form } from '../userCreate.styles';
import { Select } from '../../../form/select';
import { TextInput } from '../../../form/inputs/textInput';

describe('UserCreate: Component', () => {
  const component = props => <UserCreate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call handleSubmit on submit form', () => {
    const handleSubmit = spy();
    const wrapper = render({ handleSubmit });

    wrapper.find(Form).prop('onSubmit')();

    expect(handleSubmit).to.have.been.calledOnce;
  });

  it('should call handleChange on change of TextInput value', () => {
    const handleChange = spy();
    const wrapper = render({ handleChange });

    wrapper
      .find(TextInput)
      .first()
      .prop('handleChange')();
    expect(handleChange).to.have.been.calledOnce;
  });

  it('should call handleBlur on blur of TextInput value', () => {
    const handleBlur = spy();
    const wrapper = render({ handleBlur });

    wrapper
      .find(TextInput)
      .first()
      .prop('handleBlur')();
    expect(handleBlur).to.have.been.calledOnce;
  });

  it('should call setFieldValue on select of Select value', () => {
    const setFieldValue = spy();
    const wrapper = render({
      setFieldValue,
      isInvitation: true,
    });

    wrapper
      .find(Select)
      .first()
      .prop('onSelect')({ value: 'value' });
    expect(setFieldValue).to.have.been.calledOnce;
  });
});
