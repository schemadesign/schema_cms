import React from 'react';

import { DotsMenu } from '../dotsMenu.component';
import { defaultProps } from '../dotsMenu.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('DotsMenu: Component', () => {
  const render = props => makeContextRenderer(<DotsMenu {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render({});
    global.expect(wrapper).toMatchSnapshot();
  });
});
