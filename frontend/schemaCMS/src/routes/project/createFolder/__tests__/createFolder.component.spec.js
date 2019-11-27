import React from 'react';
import { shallow } from 'enzyme';

import { CreateFolder } from '../createFolder.component';
import { defaultProps } from '../createFolder.stories';
import { BackButton } from '../../../../shared/components/navigation';
import { Form } from '../createFolder.styles';

describe('CreateFolder: Component', () => {
  const component = props => <CreateFolder {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should return to folder list', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/1/folder');
  });

  it('should submit form', () => {
    jest.spyOn(defaultProps, 'handleSubmit');
    const wrapper = render();
    wrapper.find(Form).simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });
});
