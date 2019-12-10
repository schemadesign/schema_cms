import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Formik } from 'formik';

import { SourceComponent } from '../source.component';
import { defaultProps } from '../source.stories';
import { DEFAULT_LOCALE } from '../../../../i18n';

describe('SourceComponent: Component', () => {
  const component = props => (
    <IntlProvider locale={DEFAULT_LOCALE}>
      <SourceComponent {...defaultProps} {...props} />
    </IntlProvider>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render().dive();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render file uploader', () => {
    const props = {
      dataSource: {
        type: 'file',
      },
    };
    const wrapper = render(props).dive();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call onDataSourceChange', () => {
    jest.spyOn(defaultProps, 'onDataSourceChange');
    const values = {
      type: 'file',
    };
    const wrapper = render().dive();
    wrapper.find(Formik).prop('onSubmit')(values, {
      setSubmitting: Function.prototype,
      setErrors: Function.prototype,
    });
    expect(defaultProps.onDataSourceChange).toHaveBeenCalledWith({
      projectId: '1',
      requestData: { ...values, runLastJob: false },
    });
  });

  it('should call onDataSourceChange with file and with flag to run last job', () => {
    jest.spyOn(defaultProps, 'onDataSourceChange');
    const values = {
      type: 'file',
      file: 'file',
    };
    const wrapper = render().dive();
    wrapper.find(Formik).prop('onSubmit')(values, {
      setSubmitting: Function.prototype,
      setErrors: Function.prototype,
    });
    wrapper.find('#confirmRunLastJob').simulate('click');
    expect(defaultProps.onDataSourceChange).toHaveBeenCalledWith({
      projectId: '1',
      requestData: { ...values, runLastJob: true },
    });
  });

  it('should call onDataSourceChange with file', () => {
    jest.spyOn(defaultProps, 'onDataSourceChange');
    const values = {
      type: 'file',
      file: 'file',
    };
    const wrapper = render().dive();
    wrapper.find(Formik).prop('onSubmit')(values, {
      setSubmitting: Function.prototype,
      setErrors: Function.prototype,
    });
    wrapper.find('#declineRunLastJob').simulate('click');
    expect(defaultProps.onDataSourceChange).toHaveBeenCalledWith({
      projectId: '1',
      requestData: { ...values, runLastJob: false },
    });
  });

  it('should remove data source', () => {
    jest.spyOn(defaultProps, 'removeDataSource');

    const wrapper = render().dive();
    wrapper
      .find(Formik)
      .dive()
      .find('#removeDataSourceDesktopBtn')
      .simulate('click');
    wrapper.find('#confirmRemoveDataSource').simulate('click');

    expect(defaultProps.removeDataSource).toHaveBeenCalledWith({
      dataSourceId: 'dataSourceIdId',
      projectId: 'projectId',
    });
  });
});
