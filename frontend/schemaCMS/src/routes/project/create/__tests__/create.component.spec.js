import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { Create } from '../create.component';
import { TextInput } from '../../../../shared/components/form/inputs/textInput';
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
    const handleSubmit = spy();

    const wrapper = render({ handleSubmit });
    wrapper.find(Form).simulate('submit');
    expect(handleSubmit).to.have.been.calledOnce;
  });

  it('should call handleChange on change of TextInput value', () => {
    const handleChange = spy();

    const wrapper = render({ handleChange });
    wrapper
      .find(TextInput)
      .first()
      .prop('onChange')();
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
});
