import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { JobDetail } from '../jobDetail.component';
import { defaultProps, failureJob, fakeJob } from '../jobDetail.stories';

describe('JobDetail: Component', () => {
  const component = props => <JobDetail {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchOne = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with failure job', async () => {
    defaultProps.fetchOne = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render({ job: failureJob });
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with fake job', async () => {
    defaultProps.fetchOne = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render({ job: fakeJob });
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchOne on componentDidMount', () => {
    const fetchOne = spy();
    render({ fetchOne });
    expect(fetchOne).to.have.been.calledWith({ jobId: '1' });
  });
});
