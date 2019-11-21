import React from 'react';
import { shallow } from 'enzyme';

import { DirectoryList } from '../directoryList.component';

describe('DirectoryList: Component', () => {
  const defaultProps = {};

  const component = props => <DirectoryList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
