import React from 'react';

import { ProjectTabs } from '../projectTabs.component';
import { defaultProps } from '../projectTabs.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('ProjectTabs: Component', () => {
  const render = props => makeContextRenderer(<ProjectTabs {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
