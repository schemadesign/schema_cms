import React from 'react';
import { shallow } from 'enzyme';

import { CreateDirectory } from '../createDirectory.component';
import { defaultProps } from '../createDirectory.stories';
import { BackButton } from '../../../../shared/components/navigation';
import { Form } from '../createDirectory.styles';

describe('CreateDirectory: Component', () => {
  const component = props => <CreateDirectory {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should return to directory list', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/1/directory');
  });

  it('should submit form', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });
});
