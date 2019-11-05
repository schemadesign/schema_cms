import React from 'react';
import { shallow } from 'enzyme';

import { JobList } from '../jobList.component';
import { defaultProps } from '../jobList.stories';

describe('JobList: Component', () => {
  const component = props => <JobList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
