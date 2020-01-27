import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { DataSourceTagForm } from '../dataSourceTagForm.component';
import { defaultProps, createProps, editProps } from '../dataSourceTagForm.stories';
import { BackButton } from '../../navigation';
import { Link } from '../../../../theme/typography';

describe('DataSourceTagForm: Component', () => {
  const component = props => <DataSourceTagForm {...defaultProps} {...props} />;

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
    jest.spyOn(createProps, 'createTag');

    await render(createProps)
      .find(Formik)
      .prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors: Function.prototype });

    expect(createProps.createTag).toHaveBeenCalledTimes(1);
  });

  it('should render error on failed createTag', async () => {
    const setErrors = jest.fn().mockImplementation(Function.prototype);

    const error = [{ code: 'nameTagNameNotUniqueError', name: 'name' }];
    const wrapper = await render({
      ...createProps,
      createTag: jest.fn().mockReturnValue(Promise.reject(error)),
    });

    await wrapper.find(Formik).prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors });

    expect(setErrors).toHaveBeenCalledWith({
      name: expect.any(String),
    });
  });

  it('should call updateTag on submit update', async () => {
    jest.spyOn(editProps, 'updateTag');

    await render(editProps)
      .find(Formik)
      .prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors: Function.prototype });

    expect(editProps.updateTag).toHaveBeenCalledTimes(1);
  });

  it('should render error on failed updateTag', async () => {
    const setErrors = jest.fn().mockImplementation(Function.prototype);

    const error = [{ code: 'nameTagNameNotUniqueError', name: 'name' }];
    const wrapper = await render({
      ...editProps,
      updateTag: jest.fn().mockReturnValue(Promise.reject(error)),
    });

    await wrapper.find(Formik).prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors });

    expect(setErrors).toHaveBeenCalledWith({
      name: expect.any(String),
    });
  });

  it('should call removeTag on confirm button click', () => {
    jest.spyOn(editProps, 'removeTag');

    const wrapper = render(editProps);

    wrapper.find('#confirmRemovalBtn').simulate('click');

    expect(editProps.removeTag).toHaveBeenCalledWith({ dataSourceId: 1, tagId: 2 });
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

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper
      .find(Formik)
      .dive()
      .find(BackButton)
      .simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/datasource/1/tag');
  });
});
