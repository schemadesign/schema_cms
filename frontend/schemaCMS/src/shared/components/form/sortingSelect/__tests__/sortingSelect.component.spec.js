import React from 'react';

import { SortingSelect } from '../sortingSelect.component';
import { defaultProps } from '../sortingSelect.stories';
import { makeContextRenderer } from '../../../../utils/testUtils';

describe('SortingSelect: Component', () => {
  const render = props => makeContextRenderer(<SortingSelect {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
