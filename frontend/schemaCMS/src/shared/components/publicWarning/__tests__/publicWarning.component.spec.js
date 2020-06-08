import React from 'react';

import { PublicWarning } from '../publicWarning.component';
import { defaultProps } from '../publicWarning.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('PublicWarning: Component', () => {
  const render = props => makeContextRenderer(<PublicWarning {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
