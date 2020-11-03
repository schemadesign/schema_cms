import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { FilterForm } from '../filterForm.component';
import { defaultProps, createProps, editProps } from '../filterForm.stories';
import { BackButton } from '../../navigation';
import { Link } from '../../../../theme/typography';

describe('FilterForm: Component', () => {
  const component = props => <FilterForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render create form', () => {
    const form = render(createProps)
      .find(Formik)
      .dive();

    expect(form).toMatchSnapshot();
  });

  it('should render edit form', () => {
    const form = render(editProps)
      .find(Formik)
      .dive();

    expect(form).toMatchSnapshot();
  });

  it('should call createForm on submit new', async () => {
    jest.spyOn(createProps, 'createFilter');

    await render(createProps)
      .find(Formik)
      .prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors: Function.prototype });

    expect(createProps.createFilter).toHaveBeenCalledTimes(1);
  });

  it('should render error on failed createFilter', async () => {
    const setErrors = jest.fn().mockImplementation(Function.prototype);

    const error = [{ code: 'nameFilterNameNotUniqueError', name: 'name' }];
    const wrapper = await render({
      ...createProps,
      createFilter: jest.fn().mockReturnValue(Promise.reject(error)),
    });

    await wrapper.find(Formik).prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors });

    expect(setErrors).toHaveBeenCalledWith({
      name: expect.any(String),
    });
  });

  it('should call updateFilter on submit update', async () => {
    jest.spyOn(editProps, 'updateFilter');

    await render(editProps)
      .find(Formik)
      .prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors: Function.prototype });

    expect(editProps.updateFilter).toHaveBeenCalledTimes(1);
  });

  it('should render error on failed updateFilter', async () => {
    const setErrors = jest.fn().mockImplementation(Function.prototype);

    const error = [{ code: 'nameFilterNameNotUniqueError', name: 'name' }];
    const wrapper = await render({
      ...editProps,
      updateFilter: jest.fn().mockReturnValue(Promise.reject(error)),
    });

    await wrapper.find(Formik).prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors });

    expect(setErrors).toHaveBeenCalledWith({
      name: expect.any(String),
    });
  });

  it('should call removeFilter on confirm button click', () => {
    jest.spyOn(editProps, 'removeFilter');

    const wrapper = render(editProps);

    wrapper.find('#confirmRemovalBtn').simulate('click');

    expect(editProps.removeFilter).toHaveBeenCalledWith({ dataSourceId: 1, filterId: 2 });
  });

  it('should show modal on click remove link', () => {
    const wrapper = render(editProps);

    wrapper
      .find(Formik)
      .dive()
      .find(Link)
      .simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeTruthy();
  });

  it('should hide modal on cancel', () => {
    const wrapper = render(editProps);

    wrapper
      .find(Formik)
      .dive()
      .find(Link)
      .simulate('click');

    wrapper.find(BackButton).simulate('click');

    expect(wrapper.state().confirmationModalOpen).toBeFalsy();
  });
});
