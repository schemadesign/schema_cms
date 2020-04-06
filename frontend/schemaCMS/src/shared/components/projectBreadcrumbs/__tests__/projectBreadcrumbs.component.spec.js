import React from 'react';

import { ProjectBreadcrumbs } from '../projectBreadcrumbs.component';
import { defaultProps } from '../projectBreadcrumbs.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('ProjectBreadcrumbs: Component', () => {
  const render = props => makeContextRenderer(<ProjectBreadcrumbs {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
