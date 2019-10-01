import React from 'react';
import { shallow } from 'enzyme';

import DataPreview from '../dataPreview.component';
import { defaultProps } from '../dataPreview.stories';

describe('DataPreview: Component', () => {
  const component = props => <DataPreview {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
