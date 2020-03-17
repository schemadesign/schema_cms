import React from 'react';

import { CreatePage } from '../createPage.component';
import { defaultProps } from '../createPage.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('CreatePage: Component', () => {
  const render = props => makeContextRenderer(<CreatePage {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
