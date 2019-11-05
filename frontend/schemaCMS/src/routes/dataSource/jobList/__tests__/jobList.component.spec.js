import React from 'react';
import { shallow } from 'enzyme';

import { JobList } from '../jobList.component';

describe('JobList: Component', () => {
  const defaultProps = {};

  const component = props => <JobList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
