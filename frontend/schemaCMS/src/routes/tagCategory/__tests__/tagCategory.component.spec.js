import React from 'react';
import { shallow } from 'enzyme';

import { TagCategory } from '../tagCategory.component';
import { defaultProps } from '../tagCategory.stories';
import { BackButton } from '../../../shared/components/navigation';

describe('TagCategory: Component', () => {
  const component = props => <TagCategory {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchTag = jest.fn().mockReturnValue(Promise.resolve({ project: '1' }));
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchTagCategory on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchTagCategory');

    await render();

    expect(defaultProps.fetchTagCategory).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchTagCategory should return error';
    const wrapper = await render({
      fetchTagCategory: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });

  it('should call removeTagCategory on confirm button click', () => {
    jest.spyOn(defaultProps, 'removeTagCategory');

    const wrapper = render();

    wrapper.find('#confirmRemovalBtn').simulate('click');

    expect(defaultProps.removeTagCategory).toHaveBeenCalledWith({ projectId: 1, tagCategoryId: 2 });
  });

  it('should hide modal on cancel', () => {
    const wrapper = render();

    wrapper.setState({ confirmationModalOpen: true });

    wrapper
      .find(BackButton)
      .at(0)
      .simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeFalsy();
  });
});
