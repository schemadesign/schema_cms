import React from 'react';
import { shallow } from 'enzyme';

import { Tag } from '../tag.component';
import { defaultProps } from '../tag.stories';

describe('DataSourceViews: Component', () => {
  const component = props => <Tag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });
});
