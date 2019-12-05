import React from 'react';
import { shallow } from 'enzyme';

import { CreateFilter } from '../createFilter.component';
import { defaultProps } from '../createFilter.stories';

describe('CreateFilter: Component', () => {
  const component = props => <CreateFilter {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchPreview = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });
});
