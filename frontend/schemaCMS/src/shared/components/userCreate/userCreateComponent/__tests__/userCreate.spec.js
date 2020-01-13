import React from 'react';
import { shallow } from 'enzyme';

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
    expect(wrapper).toMatchSnapshot();
  });

  it('should call handleSubmit on submit form', () => {
    const handleSubmit = jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render({ handleSubmit });

    wrapper.find(Form).prop('onSubmit')();

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should call handleChange on change of TextInput value', () => {
    const handleChange = jest.spyOn(defaultProps, 'handleChange');
    const wrapper = render({ handleChange });

    wrapper
      .find(TextInput)
      .first()
      .prop('handleChange')();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call handleBlur on blur of TextInput value', () => {
    const handleBlur = jest.spyOn(defaultProps, 'handleBlur');
    const wrapper = render({ handleBlur });

    wrapper
      .find(TextInput)
      .first()
      .prop('handleBlur')();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should call setFieldValue on select of Select value', () => {
    const setFieldValue = jest.spyOn(defaultProps, 'setFieldValue');
    const wrapper = render({
      setFieldValue,
      isInvitation: true,
    });

    wrapper
      .find(Select)
      .first()
      .prop('onSelect')({ value: 'value' });
    expect(setFieldValue).toHaveBeenCalledTimes(1);
  });
});
