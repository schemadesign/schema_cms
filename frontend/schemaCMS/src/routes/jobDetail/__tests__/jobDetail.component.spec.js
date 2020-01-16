import React from 'react';
import { shallow } from 'enzyme';

import { JobDetail } from '../jobDetail.component';
import { defaultProps, failureJob, fakeJob } from '../jobDetail.stories';
import { Form } from '../jobDetail.styles';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';

describe('JobDetail: Component', () => {
  const component = props => <JobDetail {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const wrapper = await render({
      fetchOne: jest.fn().mockReturnValue(Promise.resolve()),
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with failure job', async () => {
    const wrapper = await render({
      fetchOne: jest.fn().mockReturnValue(Promise.resolve()),
      job: failureJob,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with fake job', async () => {
    const wrapper = await render({
      fetchOne: jest.fn().mockReturnValue(Promise.resolve()),
      job: fakeJob,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchOne on componentDidMount', () => {
    jest.spyOn(defaultProps, 'fetchOne');

    render();

    expect(defaultProps.fetchOne).toHaveBeenCalledWith({ jobId: '1' });
  });

  it('should submit form', async () => {
    jest.spyOn(defaultProps, 'handleSubmit');

    const wrapper = await render({
      fetchOne: jest.fn().mockReturnValue(Promise.resolve()),
      job: fakeJob,
    });

    wrapper
      .find(LoadingWrapper)
      .dive()
      .find(Form)
      .dive()
      .simulate('submit');

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchOne should return error';
    const wrapper = await render({
      fetchOne: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
