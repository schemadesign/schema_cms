import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceTags } from '../dataSourceTags.component';
import { defaultProps } from '../dataSourceTags.stories';

describe('DataSourceViews: Component', () => {
  const component = props => <DataSourceTags {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
  });
});
