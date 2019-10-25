import React from 'react';
import { shallow } from 'enzyme';

import { Preview } from '../preview.component';
import { defaultProps } from '../preview.stories';

describe('Preview: Component', () => {
  const component = props => <Preview {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render loader', () => {
    const previewData = {};
    const wrapper = render({ previewData });
    global.expect(wrapper).toMatchSnapshot();
  });
});
