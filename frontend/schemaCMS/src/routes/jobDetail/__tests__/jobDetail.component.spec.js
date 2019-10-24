import React from 'react';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';

import { JobDetail } from '../jobDetail.component';
import { defaultProps } from '../jobDetail.stories';

describe('JobDetail: Component', () => {
  const component = props => <JobDetail {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchOne on componentDidMount', () => {
    const fetchOne = spy();
    render({ fetchOne });
    expect(fetchOne).to.have.been.calledWith({ jobId: 1 });
  });
});
