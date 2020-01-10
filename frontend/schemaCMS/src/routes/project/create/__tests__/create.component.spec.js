import React from 'react';
import { shallow } from 'enzyme';

import { Create } from '../create.component';
import { TextInput } from '../../../../shared/components/form/inputs/textInput';
import { BackButton } from '../../../../shared/components/navigation';
import { defaultProps } from '../create.stories';
import { Form } from '../create.styles';

describe('Create: Component', () => {
  const component = props => <Create {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call handleSubmit on form submit', () => {
    jest.spyOn(defaultProps, 'handleSubmit');

    const wrapper = render();
    wrapper.find(Form).simulate('submit');
    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('should call handleChange on change of TextInput value', () => {
    jest.spyOn(defaultProps, 'handleChange');

    const wrapper = render();
    wrapper
      .find(TextInput)
      .first()
      .prop('onChange')();
    expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call handleBlur on blur of TextInput value', () => {
    jest.spyOn(defaultProps, 'handleBlur');

    const wrapper = render();
    wrapper
      .find(TextInput)
      .first()
      .prop('handleBlur')();

    expect(defaultProps.handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should redirect on click cancel', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/');
  });

  it('should redirect to not-authorized page not admin user', () => {
    jest.spyOn(defaultProps.history, 'push');
    render({ isAdmin: false });

    expect(defaultProps.history.push).toHaveBeenCalledWith('/not-authorized');
  });
});
