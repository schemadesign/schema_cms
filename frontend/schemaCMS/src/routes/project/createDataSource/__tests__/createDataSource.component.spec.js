import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { CreateDataSource } from '../createDataSource.component';
import { defaultProps } from '../createDataSource.stories';

describe('CreateDataSource: Component', () => {
  const component = props => <CreateDataSource {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call createDataSource', async () => {
    const values = { data: 'data' };
    jest.spyOn(defaultProps, 'createDataSource');
    const wrapper = render();
    await wrapper.find(Formik).prop('onSubmit')(values, { setSubmitting: Function.prototype });
    expect(defaultProps.createDataSource).toHaveBeenCalledWith({ projectId: '1', requestData: values });
  });
});
