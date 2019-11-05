import React from 'react';
import { shallow } from 'enzyme';

import { Filters } from '../filters.component';
import { defaultProps } from '../filters.stories';

describe('Filters: Component', () => {
  const component = props => <Filters {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchFilters = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });
});
