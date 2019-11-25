import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import { JobList } from '../jobList.component';
import { defaultProps, propsWithJobs } from '../jobList.stories';

describe('JobList: Component', () => {
  const component = props => <JobList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no data', async () => {
    const fetchJobList = () => Promise.resolve();
    const wrapper = await render({ fetchJobList });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with list of jobs', async () => {
    const fetchJobList = () => Promise.resolve();
    const wrapper = await render({ ...propsWithJobs, fetchJobList });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchJobList on componentDidMount', () => {
    const updatedProps = {
      ...defaultProps,
      fetchJobList: () => Promise.resolve(),
    };
    jest.spyOn(updatedProps, 'fetchJobList');
    render(updatedProps);
    expect(updatedProps.fetchJobList).toHaveBeenCalledWith({ dataSourceId: '1' });
  });

  it('should call revertToJob on Revert button click', async () => {
    const updatedProps = {
      ...propsWithJobs,
      fetchJobList: () => Promise.resolve(),
    };

    jest.spyOn(updatedProps, 'revertToJob');

    const wrapper = await render(updatedProps);

    wrapper.setState({ loading: false, selectedJob: 1, canRevert: true });
    wrapper.find('#revertBtn').simulate('click');

    expect(updatedProps.revertToJob).toHaveBeenCalledWith({ jobId: 1, dataSourceId: '1' });
  });
});
