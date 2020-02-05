import React from 'react';
import { shallow } from 'enzyme';

import { ProjectStateList } from '../projectStateList.component';
import { defaultProps, noStatesProps } from '../projectStateList.stories';

describe('ProjectStateList: Component', () => {
  const component = props => <ProjectStateList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchStates = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchStates,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when no tags', async () => {
    const fetchStates = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      ...noStatesProps,
      fetchStates,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchTags on componentDidMount', () => {
    const fetchStates = jest.spyOn(defaultProps, 'fetchStates');

    render({
      fetchStates,
    });

    expect(fetchStates).toHaveBeenCalledTimes(1);
  });
});
