import React from 'react';
import { shallow } from 'enzyme';

import { Uploader } from '../uploader.component';
import { defaultProps, withError } from '../uploader.stories';

describe('Uploader: Component', () => {
  const component = props => <Uploader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with error', () => {
    const wrapper = render(withError);
    global.expect(wrapper).toMatchSnapshot();
  });
});
