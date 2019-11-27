import React from 'react';
import { shallow } from 'enzyme';

import { Folder } from '../folder.component';
import { defaultProps } from '../folder.stories';

describe('Folder: Component', () => {
  const component = props => <Folder {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
