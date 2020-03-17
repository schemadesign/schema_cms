import React from 'react';

import { Page } from '../page.component';
import { defaultProps } from '../page.stories';
import { makeContextRenderer } from '../../../shared/utils/testUtils';

describe('Page: Component', () => {
  const render = props => makeContextRenderer(<Page {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
