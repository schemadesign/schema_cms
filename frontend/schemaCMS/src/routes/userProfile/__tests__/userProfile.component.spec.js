import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { UserProfile } from '../userProfile.component';
import { INITIAL_VALUES } from '../../../modules/userProfile/userProfile.constants';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Form } from '../userProfile.styles';

describe('UserProfile: Component', () => {
  const defaultProps = {
    values: INITIAL_VALUES,
    handleChange: Function.prototype,
    handleSubmit: Function.prototype,
    intl: {
      formatMessage: Function.prototype,
    },
  };

  const component = props => <UserProfile {...defaultProps} {...props} />;

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
    wrapper.find(TextInput).first().prop('onChange')();
    expect(handleChange).to.have.been.calledOnce;
  });
});
