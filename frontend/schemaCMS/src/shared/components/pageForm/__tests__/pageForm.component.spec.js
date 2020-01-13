import React from 'react';
import { shallow } from 'enzyme';

import { PageForm } from '../pageForm.component';
import { defaultProps } from '../pageForm.stories';
import { TextInput } from '../../form/inputs/textInput';

describe('PageForm: Component', () => {
  const component = props => <PageForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
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
});
