import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { JobList } from '../jobList.component';
import { defaultProps, propsWithJobs } from '../jobList.stories';

describe('JobList: Component', () => {
  const component = props => <JobList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchJobList on componentDidMount', () => {
    const fetchJobList = spy();
    render({ fetchJobList });
    expect(fetchJobList).to.have.been.calledWith({ dataSourceId: '1' });
  });

  it('should call revertToJob on Revert button click', () => {
    const revertToJob = spy();
    const wrapper = render({ ...propsWithJobs, revertToJob });
    wrapper.setState({ selectedJob: '1' });
    wrapper.find('#revertBtn').simulate('click');
    expect(revertToJob).to.have.been.calledWith({ jobId: '1' });
  });
});
