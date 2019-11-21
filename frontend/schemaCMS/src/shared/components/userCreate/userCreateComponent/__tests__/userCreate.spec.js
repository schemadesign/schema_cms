import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import { UserCreate } from '../userCreate.component';
import { defaultProps } from '../userCreate.stories';
import { TextInput } from '../../../form/inputs/textInput';

describe('UserCreate: Component', () => {
  const component = props => <UserCreate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
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
});
