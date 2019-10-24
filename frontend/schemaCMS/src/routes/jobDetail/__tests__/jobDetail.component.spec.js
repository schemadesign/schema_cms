import React from 'react';
import { shallow } from 'enzyme';

import { JobDetail } from '../jobDetail.component';

describe('JobDetail: Component', () => {
  const defaultProps = {};

  const component = props => <JobDetail {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
