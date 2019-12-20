import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';
import { defaultProps } from '../view.stories';
import { LoadingWrapper } from '../../../../shared/components/loadingWrapper';

describe('View: Component', () => {
  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render content correctly', async () => {
    defaultProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render();
    await Promise.resolve();
    const content = wrapper.find(LoadingWrapper).dive();
    expect(content).toMatchSnapshot();
  });

  it('should call fetchProject prop on componentDidMount', async () => {
    const projectId = '1';
    const props = {
      fetchProject: Function.prototype,
      match: {
        params: {
          projectId,
        },
      },
    };
    jest.spyOn(props, 'fetchProject');

    await render(props);

    expect(props.fetchProject).toHaveBeenCalledWith({ projectId });
  });
});
