import React from 'react';
import { shallow } from 'enzyme';

import { CreatePage } from '../createPage.component';
import { defaultProps } from '../createPage.stories';
import { Form } from '../createPage.styles';

describe('CreatePage: Component', () => {
  const component = props => <CreatePage {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should push a new state to history on back click', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find('#cancelBtn').simulate('click');
    expect(defaultProps.history.push).toHaveBeenCalledWith(`/directory/${defaultProps.match.params.directoryId}`);
  });

  it('should call handleSubmit on form submit', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');
    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });
});
