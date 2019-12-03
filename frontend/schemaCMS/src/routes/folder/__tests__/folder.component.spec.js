import React from 'react';
import { shallow } from 'enzyme';

import { Folder } from '../folder.component';

describe('Folder: Component', () => {
  const defaultProps = {
    match: {
      path: 'path',
    },
  };

  const component = props => <Folder {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
