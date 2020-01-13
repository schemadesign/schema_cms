import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { Form } from 'schemaUI';

import { Filters } from '../filters.component';
import { defaultProps } from '../filters.stories';

describe('Filters: Component', () => {
  const component = props => <Filters {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchFilters = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({
      fetchFilters,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchFilters on componentDidMount', () => {
    const fetchFilters = jest.spyOn(defaultProps, 'fetchFilters');

    render({
      fetchFilters,
    });

    expect(fetchFilters).toHaveBeenCalledTimes(1);
  });

  it('should call setFilters on submit', async () => {
    const fetchFilters = jest.fn().mockReturnValue(Promise.resolve());
    const setFilters = jest.spyOn(defaultProps, 'setFilters');
    const active = [];

    const wrapper = await render({
      fetchFilters,
      setFilters,
    }).find(Formik);

    wrapper
      .dive()
      .find(Form.CheckboxGroup)
      .simulate('change', { target: { checked: true } });

    wrapper.prop('onSubmit')(active, {
      setSubmitting: Function.prototype,
      setErrors: Function.prototype,
    });

    expect(setFilters).toHaveBeenCalledTimes(1);
  });
});
