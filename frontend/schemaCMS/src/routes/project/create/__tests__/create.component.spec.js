import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { Create } from '../create.component';
import { TextInput } from '../../../../shared/components/form/inputs/textInput';
import { PROJECT_TITLE } from '../../../../modules/project/project.constants';

describe('Create: Component', () => {
  const defaultProps = {
    values: {
      [PROJECT_TITLE]: '',
    },
    handleChange: Function.prototype,
    handleSubmit: Function.prototype,
    touched: {},
    errors: {},
  };

  const component = props => <Create {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call handleSubmit on form submit', () => {
    const handleSubmit = spy();

    const wrapper = render({ handleSubmit });
    wrapper.find('form').simulate('submit');
    expect(handleSubmit).to.have.been.calledOnce;
  });

  it('should call handleChange on change of TextInput value', () => {
    const handleChange = spy();

    const wrapper = render({ handleChange });
    wrapper.find(TextInput).prop('onChange')();
    expect(handleChange).to.have.been.calledOnce;
  });
});
