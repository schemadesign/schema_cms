import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { Form } from 'schemaUI';

import { ProjectTags } from '../projectTags.component';
import { defaultProps, noTagsProps } from '../projectTags.stories';

describe('ProjectTags: Component', () => {
  const component = props => <ProjectTags {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchTags = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchTags,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when no tags', async () => {
    const fetchTags = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      ...noTagsProps,
      fetchTags,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchTags on componentDidMount', () => {
    const fetchTags = jest.spyOn(defaultProps, 'fetchTags');

    render({
      fetchTags,
    });

    expect(fetchTags).toHaveBeenCalledTimes(1);
  });

  it('should call setTags on submit', async () => {
    const fetchTags = jest.fn().mockReturnValue(Promise.resolve());
    const setTags = jest.spyOn(defaultProps, 'setTags');
    const active = [];

    const wrapper = await render({
      fetchTags,
      setTags,
    }).find(Formik);

    wrapper
      .dive()
      .find(Form.CheckboxGroup)
      .simulate('change', { target: { checked: true } });

    wrapper.prop('onSubmit')(active, {
      setSubmitting: Function.prototype,
      setErrors: Function.prototype,
    });

    expect(setTags).toHaveBeenCalledTimes(1);
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchTags should return error';
    const wrapper = await render({
      fetchTags: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
