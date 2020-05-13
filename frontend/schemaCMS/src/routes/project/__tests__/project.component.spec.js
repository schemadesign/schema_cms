import React from 'react';
import { shallow } from 'enzyme';

import { Project } from '../project.component';

describe('Project: Component', () => {
  const defaultProps = {
    match: {
      path: '/project',
      params: {
        projectId: 1,
      },
    },
    project: {
      id: 1,
    },
    fetchProject: Function.prototype,
  };

  const component = props => <Project {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading wrapper content is called', async () => {
    const wrapper = await render({
      fetchProject: jest.fn().mockReturnValue(Promise.resolve()),
    });
    global.expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should call fetchProject prop on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchProject');

    await render();

    expect(defaultProps.fetchProject).toHaveBeenCalledWith({ projectId: 1 });
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchProject should return error';
    const wrapper = await render({
      fetchProject: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
