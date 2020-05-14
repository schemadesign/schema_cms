import React from 'react';

import { TagSearch } from '../tagSearch.component';
import { defaultProps } from '../tagSearch.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('TagSearch: Component', () => {
  const render = props => makeContextRenderer(<TagSearch {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no tag categories', async () => {
    const wrapper = await render({ tagCategories: [] });
    expect(wrapper).toMatchSnapshot();
  });
});
