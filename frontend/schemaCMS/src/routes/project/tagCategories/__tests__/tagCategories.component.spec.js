import React from 'react';
import { shallow } from 'enzyme';

import { TagCategories } from '../tagCategories.component';
import { defaultProps, noTagsProps } from '../tagCategories.stories';

describe('TagCategories: Component', () => {
  const component = props => <TagCategories {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchTagCategories = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchTagCategories,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when no categories', async () => {
    const fetchTagCategories = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      ...noTagsProps,
      fetchTagCategories,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchTags on componentDidMount', () => {
    const fetchTagCategories = jest.spyOn(defaultProps, 'fetchTagCategories');

    render({
      fetchTagCategories,
    });

    expect(fetchTagCategories).toHaveBeenCalledTimes(1);
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchTagCategories should return error';
    const wrapper = await render({
      fetchTagCategories: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });

  it('should go to tag category', async () => {
    jest.spyOn(defaultProps.history, 'push');
    const fetchTagCategories = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({ fetchTagCategories });
    wrapper.find('#tag-category-1').simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/tag-category/1');
  });
});
