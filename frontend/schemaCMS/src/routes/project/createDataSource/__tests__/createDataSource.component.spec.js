import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { CreateDataSource } from '../createDataSource.component';
import { defaultProps } from '../createDataSource.stories';
import { BackButton } from '../../../../shared/components/navigation';

describe('CreateDataSource: Component', () => {
  const component = props => <CreateDataSource {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call createDataSource', async () => {
    jest.spyOn(defaultProps, 'createDataSource');

    const values = { data: 'data' };
    const wrapper = await render();

    wrapper.find(Formik).prop('onSubmit')(values, { setSubmitting: Function.prototype });

    expect(defaultProps.createDataSource).toHaveBeenCalledWith({ projectId: '1', requestData: values });
  });

  it('should render error on failed createDataSource', async () => {
    const setErrors = jest.fn().mockImplementation(Function.prototype);

    const error = [{ code: 'dataSourceProjectNameUnique', name: 'name' }];
    const wrapper = await render({
      createDataSource: jest.fn().mockReturnValue(Promise.reject(error)),
    });

    await wrapper.find(Formik).prop('onSubmit')({}, { setSubmitting: Function.prototype, setErrors });

    expect(setErrors).toHaveBeenCalledWith({
      name: expect.any(String),
    });
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();

    wrapper
      .find(Formik)
      .dive()
      .find(BackButton)
      .simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/1/datasource');
  });
});
