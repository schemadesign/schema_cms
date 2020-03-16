import React from 'react';

import { Content } from '../content.component';
import { defaultProps } from '../content.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('Content: Component', () => {
  const render = props => makeContextRenderer(<Content {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });
});
